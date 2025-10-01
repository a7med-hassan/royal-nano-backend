const dbConnect = require("../lib/dbConnect");
const Review = require("../models/Review");
const RateLimitMap = new Map(); // simple in-memory rate limit per ip (serverless note: resets per instance)
const xss = require("xss");

// Simple in-memory cache for GET /api/reviews (per instance)
const ReviewsCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60s

function getCacheKey(query) {
  const page = query.page || "1";
  const limit = query.limit || "12";
  const sort = (query.sort || "created_at_desc").toLowerCase();
  return `${page}|${limit}|${sort}`;
}

function getFromCache(query) {
  const key = getCacheKey(query);
  const entry = ReviewsCache.get(key);
  if (entry && Date.now() < entry.expireAt) {
    return entry.payload;
  }
  if (entry) ReviewsCache.delete(key);
  return null;
}

function setCache(query, payload) {
  const key = getCacheKey(query);
  ReviewsCache.set(key, { payload, expireAt: Date.now() + CACHE_TTL_MS });
}

function getClientIp(req) {
  return (
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    req.ip ||
    ""
  );
}

function isProfane(text) {
  // very simple profanity placeholder; replace with better list/service if needed
  const bad = ["fuck", "shit", "bitch"].map((w) => new RegExp(`\\b${w}\\b`, "i"));
  return bad.some((re) => re.test(text));
}

async function verifyCaptcha(token) {
  // placeholder: expect upstream to provide valid token; always pass if not configured
  if (!process.env.RECAPTCHA_SECRET && !process.env.HCAPTCHA_SECRET) return true;
  try {
    if (process.env.RECAPTCHA_SECRET) {
      const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET,
          response: token || "",
        }),
      });
      const data = await res.json();
      return !!data.success;
    }
    if (process.env.HCAPTCHA_SECRET) {
      const res = await fetch("https://hcaptcha.com/siteverify", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          secret: process.env.HCAPTCHA_SECRET,
          response: token || "",
        }),
      });
      const data = await res.json();
      return !!data.success;
    }
    return false;
  } catch (e) {
    return false;
  }
}

module.exports = async function handler(req, res) {
  // CORS (tighten for POST)
  const allowed = (process.env.ALLOWED_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.origin;
  const allowAny = allowed.includes("*");
  const isAllowed = allowAny || (origin && allowed.includes(origin));

  if (req.method === "POST") {
    res.setHeader("Access-Control-Allow-Origin", isAllowed ? origin || "" : "");
  } else {
    res.setHeader("Access-Control-Allow-Origin", allowAny ? "*" : origin || "");
  }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    try {
      await dbConnect();
      const page = Math.max(parseInt(req.query.page || "1", 10), 1);
      const limit = Math.min(Math.max(parseInt(req.query.limit || "12", 10), 1), 50);
      const sortParam = (req.query.sort || "created_at_desc").toLowerCase();
      const sort = sortParam === "created_at_asc" ? { created_at: 1 } : { created_at: -1 };

      // Cache-Control headers for CDN and browser
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=30");

      // In-memory cache (skip if nocache=1)
      if (req.query.nocache !== "1") {
        const cached = getFromCache(req.query);
        if (cached) {
          return res.status(200).json(cached);
        }
      }

      const filter = { status: "approved" };
      const [items, total] = await Promise.all([
        Review.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).lean(),
        Review.countDocuments(filter),
      ]);

      const payload = { success: true, data: items, page, limit, total };
      setCache(req.query, payload);
      res.status(200).json(payload);
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
    return;
  }

  if (req.method === "POST") {
    try {
      await dbConnect();

      const ip = getClientIp(req);
      const now = Date.now();
      const bucket = RateLimitMap.get(ip) || [];
      const windowMs = 60 * 60 * 1000; // 1h
      const recent = bucket.filter((t) => now - t < windowMs);
      if (recent.length >= 5) {
        return res.status(429).json({ success: false, message: "Too many requests. Please try later." });
      }

      const { name, text, rating, photo_url, captcha_token } = req.body || {};
      if (!name || typeof name !== "string" || name.trim().length === 0 || name.length > 100) {
        return res.status(400).json({ success: false, message: "Invalid name" });
      }
      if (!text || typeof text !== "string" || text.trim().length === 0) {
        return res.status(400).json({ success: false, message: "Invalid text" });
      }
      if (rating !== undefined) {
        const r = Number(rating);
        if (!Number.isFinite(r) || r < 1 || r > 5) {
          return res.status(400).json({ success: false, message: "Invalid rating" });
        }
      }

      const captchaOk = await verifyCaptcha(captcha_token);
      if (!captchaOk) {
        return res.status(400).json({ success: false, message: "Captcha verification failed" });
      }

      const sanitizedName = xss(name.trim());
      const sanitizedText = xss(text.trim());
      if (isProfane(sanitizedName) || isProfane(sanitizedText)) {
        // Keep but mark pending; here simply continue with default status
      }

      const review = await Review.create({
        name: sanitizedName,
        text: sanitizedText,
        rating: rating !== undefined ? Number(rating) : undefined,
        photo_url,
        status: "pending",
        created_ip: ip,
      });

      // store rate timestamp
      recent.push(now);
      RateLimitMap.set(ip, recent);

      res.status(201).json({ success: true, message: "Review created", data: review });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
    return;
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
};


