const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    carType: { type: String, required: false },
    carModel: { type: String, required: false },
    additionalNotes: { type: String, required: false },
    serviceType: { type: String, required: false },
    utm_source: { type: String, required: false },
    utm_medium: { type: String, required: false },
    utm_campaign: { type: String, required: false },
    formSource: { type: String, default: "unspecified" },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
