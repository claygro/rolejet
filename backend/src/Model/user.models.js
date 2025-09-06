import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    googleId: { type: String },
    applyJob: [{ type: mongoose.Schema.Types.ObjectId, ref: "joJobPost" }],
    // New fields
    age: { type: Number },
    profilePic: { type: String }, // image url
    experience: { type: String }, // e.g., "2 years in React.js", "Fresher"
    lookingFor: { type: String }, // e.g., "Frontend Developer", "Backend Developer"
    available: { type: String }, // available for full time, part time.
    preference: { type: String }, // e.g., "Remote", "On-site", "Hybrid"
    location: { type: String },

    // Applied jobs
    applyJob: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
  },
  {
    timestamps: true,
  }
);
const UserModel = mongoose.model("user", userSchema);
export default UserModel;
