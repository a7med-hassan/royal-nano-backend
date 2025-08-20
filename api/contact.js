import dbConnect from "../lib/dbConnect";
import Contact from "../models/Contact";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { fullName, phoneNumber, carType, carModel, additionalNotes } =
        req.body;

      // Validate required fields
      if (!fullName || !phoneNumber || !carType || !carModel) {
        return res.status(400).json({
          success: false,
          message:
            "All required fields are required: fullName, phoneNumber, carType, carModel",
        });
      }

      const contact = new Contact({
        fullName,
        phoneNumber,
        carType,
        carModel,
        additionalNotes,
      });
      await contact.save();

      res.status(200).json({
        success: true,
        message: "Car protection service request saved successfully",
        data: contact,
      });
    } catch (error) {
      console.error("Contact save error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    try {
      const contacts = await Contact.find({})
        .sort({ createdAt: -1 })
        .select("-__v");

      res.status(200).json({
        success: true,
        message: "Contacts retrieved successfully",
        data: contacts,
        count: contacts.length,
      });
    } catch (error) {
      console.error("Contact retrieval error:", error);
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
}
