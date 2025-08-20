const dbConnect = require("../lib/dbConnect");
const Join = require("../models/Join");

module.exports = async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const {
        fullName,
        phoneNumber,
        email,
        jobPosition,
        experience,
        additionalMessage,
        cvFileName,
        cvPath,
      } = req.body;

      // Validate required fields
      if (!fullName || !phoneNumber || !jobPosition) {
        return res.status(400).json({
          success: false,
          message:
            "Required fields are missing: fullName, phoneNumber, jobPosition",
        });
      }

      const join = new Join({
        fullName,
        phoneNumber,
        email,
        jobPosition,
        experience,
        additionalMessage,
        cvFileName,
        cvPath,
        status: "pending", // Default status
      });
      await join.save();

      res.status(200).json({
        success: true,
        message: "Job application submitted successfully",
        data: join,
      });
    } catch (error) {
      console.error("Join save error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const joins = await Join.find({}).sort({ createdAt: -1 }).select("-__v");

      res.status(200).json({
        success: true,
        message: "Job applications retrieved successfully",
        data: joins,
        count: joins.length,
      });
    } catch (error) {
      console.error("Join retrieval error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method not allowed. Use POST to submit or GET to retrieve.",
    });
  }
};
