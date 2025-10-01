const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    text: { type: String, required: true, trim: true },
    rating: { type: Number, min: 1, max: 5 },
    photo_url: { type: String, maxlength: 500 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    created_ip: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// Indexes
ReviewSchema.index({ status: 1, created_at: -1 });
ReviewSchema.index({ created_at: -1 });

module.exports =
  mongoose.models.Review || mongoose.model("Review", ReviewSchema);


