import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  location: { type: String, required: true },
  industry: { type: String, required: true },
  image: { type: String },
  job: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPost" }],
});
const CompanyModel = mongoose.model("Company", companySchema);
export default CompanyModel;
