import jwt from "jsonwebtoken";
import CompanyModel from "../Model/company.models.js";
import "dotenv/config";

const companyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.companyToken;
    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    const data = jwt.verify(token, process.env.JWT_SECRET_TOKEN); // make sure secret key name matches
    if (!data) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find company by email from token
    const company = await CompanyModel.findOne({ email: data.email });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    req.company = company; // attach full company object
    next();
  } catch (err) {
    console.log("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export default companyAuth;
