import mongoose, { Schema } from "mongoose";

const URLSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
      default:
        "https://res.cloudinary.com/alphas/image/upload/v1723571495/clnk/clnk-icon_2x_qdqhjl.png",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("URL", URLSchema);
