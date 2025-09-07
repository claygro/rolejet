import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Model/user.models.js";
import CompanyModel from "../Model/company.models.js";
import PostModel from "../Model/jobPost.models.js";
class Companycontroller {
  //for company signup
  async signupCompany(req, res) {
    try {
      if (!req.body || Object.keys(req.body).length === 0) {
        return res
          .status(400)
          .json({ message: "No data received. Check form fields." });
      }

      const { name, industry, location, password, confirmPassword, email } =
        req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      if (
        !name ||
        !email ||
        !password ||
        !confirmPassword ||
        !industry ||
        !location
      ) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Password validation: at least 8 characters and one special character
      const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters and contain at least one special character.",
        });
      }

      // Confirm password
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match." });
      }

      // Email domain validation
      const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
      const emailDomain = email.split("@")[1];
      if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({
          message: "Email must be a valid Gmail, Yahoo, or Outlook address.",
        });
      }

      // Check if company already exists
      const existCompany = await CompanyModel.findOne({
        $or: [{ name }, { email }],
      });
      if (existCompany) {
        return res.status(409).json({ message: "Company already exists" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newCompany = await CompanyModel.create({
        name,
        industry,
        image: imageUrl,
        location,
        email,
        password: hashPassword,
      });

      const companyToken = jwt.sign(
        { email, name, companyid: newCompany._id },
        process.env.JWT_SECRET_TOKEN
      );

      res.cookie("companyToken", companyToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ newCompany, companyToken });
    } catch (err) {
      console.error("Error in company signup:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async companyCookie(req, res) {
    const companyToken = req.cookies.companyToken;
    if (!companyToken)
      res.status(404).json({ message: "You are not authorized" });
    else res.status(200).json(companyToken);
  }
  async postJob(req, res) {
    const { email } = req.body;
    const {
      title,
      description,
      jobType,
      requiredSkills,
      experience,
      location,
      workMode,
    } = req.body;

    try {
      const company = await CompanyModel.findOne({ email });
      if (!company)
        return res.status(404).json({ message: "Company not found" });

      const newJob = await PostModel.create({
        title,
        description,
        jobType,
        requiredSkills: requiredSkills.split(",").map((skill) => skill.trim()), // comma separated input
        experience,
        location,
        workMode,
      });

      newJob.company.push(company._id);
      await newJob.save();

      company.job.push(newJob._id);
      await company.save();

      res.status(201).json(newJob);
    } catch (err) {
      console.log(`Error in posting job: ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getCompanyJob(req, res) {
    const { email } = req.body;
    try {
      const company = await CompanyModel.findOne({ email: email }).populate(
        "job"
      );
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      const jobs = await PostModel.find({ company: company._id });
      res.status(200).json(jobs);
    } catch (err) {
      console.log(`error in getting company jobs ${err}`);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }
  // getting job by id
  async getJobById(req, res) {
    const { id } = req.params;
    try {
      const job = await PostModel.findById(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json(job);
    } catch (err) {
      console.log(`error in getting job by id ${err}`);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }
  //get all the company.
  async getCompanyDetails(req, res) {
    const { email } = req.body;
    try {
      const companies = await CompanyModel.findOne({ email: email });
      res.status(200).json(companies);
    } catch (err) {
      console.log(`error in getting company details ${err}`);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }
  //async logout.
  async logout(req, res) {
    try {
      await res.cookie("companyToken", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Use true for HTTPS
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // "None" for cross-origin
        maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expiry time (30 days)
      });
      res.status(200).json({ message: "Logout successful" });
    } catch (err) {
      console.log(`error in logout ${err}`);
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  }
  //login company.
  async loginCompany(req, res) {
    const { email, password } = req.body;
    try {
      const company = await CompanyModel.findOne({
        email: email,
      });
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      bcrypt.compare(password, company.password, function (err, result) {
        if (err) {
          console.log(`error in comparing password ${err}`);
          return res.status(500).json({ message: "Something went wrong" });
        }

        if (!result) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        // ✅ password matched
        const companyToken = jwt.sign(
          { email: company.email, name: company.name, companyid: company._id },
          process.env.JWT_SECRET_TOKEN
        );

        res.cookie("companyToken", companyToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
          message: "Login successfully",
          company: { name: company.name, email: company.email },
          companyToken,
        });
      });
    } catch (err) {
      console.log(`error in login ${err}`);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  //updating profile pic
  async updateProfilePic(req, res) {
    try {
      // 1. Get token from cookies
      const token = req.cookies.companyToken;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // 2. Decode token to get company email
      const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
      const email = decoded.email;

      // 3. Check if file uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      // 4. Update company profile pic
      const updatedCompany = await CompanyModel.findOneAndUpdate(
        { email }, // filter by email from JWT
        { image: imageUrl },
        { new: true }
      );

      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        image: updatedCompany.image,
      });
    } catch (err) {
      console.error("Error updating profile pic:", err);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  //updating company details.
  async updateCompanyDetails(req, res) {
    const { email, password, location, industry, name } = req.body; // include name
    const { id } = req.company; // from middleware

    try {
      let updateData = {};

      if (name) updateData.name = name;
      if (email) updateData.email = email;
      if (location) updateData.location = location;
      if (industry) updateData.industry = industry;

      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const updatedCompany = await CompanyModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      if (!updatedCompany) {
        return res.status(404).json({ message: "Company not found" });
      }

      // Update the JWT cookie if the name changed
      const companyToken = jwt.sign(
        { email: updatedCompany.email, name: updatedCompany.name },
        process.env.JWT_SECRET_TOKEN
      );

      res.cookie("companyToken", companyToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({
        message: "Company details updated successfully",
        company: {
          id: updatedCompany._id,
          name: updatedCompany.name,
          email: updatedCompany.email,
          location: updatedCompany.location,
          industry: updatedCompany.industry,
        },
      });
    } catch (err) {
      console.log(`error in updating company details ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  //delete job post.
  async deleteJob(req, res) {
    const { id } = req.params;
    try {
      await PostModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Delete successfully" });
    } catch (err) {
      console.log(`Error in delete the post ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async getApplyJobApplicants(req, res) {
    try {
      const companyId = req.company._id;

      if (!companyId) {
        return res.status(400).json({ message: "Company ID not found" });
      }

      const jobsWithApplicants = await PostModel.find({
        company: { $in: [companyId] }, // company is an array in PostModel
        "userApply.0": { $exists: true }, // only jobs with applicants
      });

      res.status(200).json({ jobs: jobsWithApplicants });
    } catch (err) {
      console.log("Error in job applicants", err);
      res.status(500).json({ message: "Error in job applicants" });
    }
  }
  async deleteApplicants(req, res) {
    const { id } = req.params; // this will be applicantId
    const { jobId } = req.body; // jobId will be sent from frontend

    try {
      // find job and remove applicant by applicant subdocument _id
      const updatedJob = await PostModel.findByIdAndUpdate(
        jobId,
        {
          $pull: { userApply: { _id: id } }, // delete applicant using applicantId
        },
        { new: true }
      );

      if (!updatedJob) {
        return res.status(404).json({ message: "Job not found" });
      }

      res.status(200).json({
        message: "Applicant deleted successfully",
        job: updatedJob,
      });
    } catch (err) {
      console.log(`error in delete applicants ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
export default Companycontroller;
