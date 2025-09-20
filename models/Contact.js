const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    carType: { type: String, required: true },
    carModel: { type: String, required: true },
    additionalNotes: { type: String, required: false },
    utm_source: { type: String, required: false },
    utm_medium: { type: String, required: false },
    utm_campaign: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
