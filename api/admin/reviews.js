const dbConnect = require("../../lib/dbConnect");
const Review = require("../../models/Review");
const { verifyToken } = require("../../lib/auth");

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Auth
  await new Promise((resolve) => verifyToken(req, res, resolve));
  if (!req.admin) return; // verifyToken already responded on failure

  await dbConnect();

  // GET: list with filters
  if (req.method === "GET") {
    try {
      const {
        status,
        q,
        from,
        to,
        page = "1",
        limit = "20",
        sort = "created_at_desc",
      } = req.query || {};

      const filter = {};
      if (status) filter.status = status;
      if (q) {
        filter.$or = [
          { name: { $regex: q, $options: "i" } },
          { text: { $regex: q, $options: "i" } },
        ];
      }
      if (from || to) {
        filter.created_at = {};
        if (from) filter.created_at.$gte = new Date(from);
        if (to) filter.created_at.$lte = new Date(to);
      }
      const pageNum = Math.max(parseInt(page, 10), 1);
      const limitNum = Math.min(Math.max(parseInt(limit, 10), 1), 100);
      const sortObj = sort === "created_at_asc" ? { created_at: 1 } : { created_at: -1 };

      const [items, total] = await Promise.all([
        Review.find(filter).sort(sortObj).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
        Review.countDocuments(filter),
      ]);

      res.status(200).json({ success: true, data: items, page: pageNum, limit: limitNum, total });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
    return;
  }

  // PATCH single status
  if (req.method === "PATCH" && req.query.id && req.url.endsWith("/status")) {
    try {
      const { status } = req.body || {};
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
      const updated = await Review.findByIdAndUpdate(
        req.query.id,
        { $set: { status } },
        { new: true }
      );
      if (!updated) return res.status(404).json({ success: false, message: "Not found" });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
    return;
  }

  // DELETE single
  if (req.method === "DELETE" && req.query.id) {
    try {
      const deleted = await Review.findByIdAndDelete(req.query.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
      res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
    return;
  }

  // BULK actions
  if (req.method === "PATCH" && req.url.endsWith("/bulk")) {
    try {
      const { ids = [], status } = req.body || {};
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "ids required" });
      }
      if (status && !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ success: false, message: "Invalid status" });
      }
      let result;
      if (status) {
        result = await Review.updateMany({ _id: { $in: ids } }, { $set: { status } });
      } else {
        result = await Review.deleteMany({ _id: { $in: ids } });
      }
      res.status(200).json({ success: true, result });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
    return;
  }

  res.status(405).json({ success: false, message: "Method not allowed" });
};


