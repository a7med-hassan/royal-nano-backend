import mongoose from "mongoose";

const JoinSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: false },
    jobPosition: { type: String, required: true },
    experience: { type: String, required: false },
    additionalMessage: { type: String, required: false },
    cvFileName: { type: String, required: false },
    cvPath: { type: String, required: false },
    status: {
      type: String,
      enum: ["pending", "reviewed", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Join || mongoose.model("Join", JoinSchema);
