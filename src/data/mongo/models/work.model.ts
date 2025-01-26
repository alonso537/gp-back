import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assigningTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "IN_PROGRESS", "CHEKING", "COMPLETED", "CANCELED"],
    },
    priority: {
      type: String,
      default: "LOW",
      enum: ["LOW", "MEDIUM", "HIGH"],
    },
    limitDate: {
      type: Date,
      required: [true, "Limit date is required"],
    },
  },
  {
    timestamps: true,
  }
);

workSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.password;
  },
});

export const WorkModel = mongoose.model("Work", workSchema);
