import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    carType: { type: String, required: true },
    carModel: { type: String, required: true },
    additionalNotes: { type: String, required: false },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model("Contact", ContactSchema);
