import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  requiredSkills: {
    type: [String],
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  jobType: {
    type: String,

    required: true,
  },
  location: {
    type: String,

    required: true,
  },
  workMode: {
    type: String,

    required: true,
  },
  company: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  userApply: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      username: String,
      email: String,
      cv: String, // URL or filename
      description: String,
      phoneno: Number,
      appliedAt: { type: Date, default: Date.now },
    },
  ],
});
const PostModel = mongoose.model("JobPost", postSchema);
export default PostModel;
