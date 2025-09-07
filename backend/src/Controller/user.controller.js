import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../Model/user.models.js";
import PostModel from "../Model/jobPost.models.js";

class UserController {
  // Signup
  async signup(req, res) {
    const { username, email, password, conformPassword } = req.body;
    try {
      const userExist = await UserModel.findOne({ email });
      if (userExist) {
        return res.status(409).json({ message: "Email is already taken" });
      }
      const passwordRegex = /^(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/;
      if (
        !passwordRegex.test(password) &&
        !passwordRegex.test(conformPassword)
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 8 characters long and contain at least one special character",
        });
      }

      if (password !== conformPassword && conformPassword !== password) {
        return res
          .status(403)
          .json({ message: "Please enter your password correctly" });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const response = await UserModel.create({
        username,
        email,
        password: hash,
      });

      let job_auth_token = jwt.sign(
        { email: email, userid: response._id, username: username },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "30d" }
      );

      res.cookie("job_auth_token", job_auth_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(response);
    } catch (err) {
      console.log(`Error in signup user ${err}`);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Setup profile
  async setupProfile(req, res) {
    const { age, experience, lookingFor, available, preference, location } =
      req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const { userid } = req.user;

    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userid,
        {
          age,
          profilePic: imageUrl,
          experience,
          lookingFor,
          available,
          preference,
          location,
        },
        { new: true }
      );

      res.json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
      console.log("Error in setup profile:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Login
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      let job_auth_token = jwt.sign(
        { email: email, userid: user._id, username: user.email },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "30d" }
      );

      res.cookie("job_auth_token", job_auth_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Login successful", user });
    } catch (err) {
      console.error("Error logging in:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Logout
  async logout(req, res) {
    try {
      await res.cookie("job_auth_token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });
      res.status(200).json({ message: "successfully logout" });
    } catch (err) {
      console.error("Error logging out:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  // Search Jobs
  async searchJobs(req, res) {
    const { query, location, workMode, category } = req.query;

    try {
      const filter = {};

      // Title / Description / Skills search
      if (query && query.trim() !== "") {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { requiredSkills: { $regex: query, $options: "i" } },
        ];
      }

      // Location filter only if provided
      if (
        location &&
        location.trim() !== "" &&
        location.toLowerCase() !== "all"
      ) {
        filter.location = { $regex: location, $options: "i" };
      }

      // Work mode filter
      if (
        workMode &&
        workMode.trim() !== "" &&
        workMode.toLowerCase() !== "all"
      ) {
        filter.workMode = { $regex: workMode, $options: "i" };
      }

      // Category filter
      if (
        category &&
        category.trim() !== "" &&
        category.toLowerCase() !== "all"
      ) {
        filter.jobType = { $regex: category, $options: "i" };
      }

      const jobs = await PostModel.find(filter);
      res.status(200).json(jobs);
    } catch (err) {
      console.error("Error searching jobs:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAllJobs(req, res) {
    try {
      const jobs = await PostModel.find();
      res.status(200).json(jobs);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async userJobDetail(req, res) {
    const { id } = req.params;
    try {
      const job = await PostModel.findById(id).populate("company");
      if (!job) {
        res.status(400).json({ message: "Job detail not found" });
      } else {
        res.status(200).json({ message: "Job detail found", job });
      }
    } catch (err) {
      console.log(`Error in job details ${err}`);
      res.status(500).json({ message: "Error in job details" });
    }
  }

  // Apply for job
  async userJobApply(req, res) {
    try {
      const { description, jobId, phoneno } = req.body;
      const { username, email } = req.user; // get from cookie/session
      const cv = req.file ? `/uploads/${req.file.filename}` : null;

      // Validation
      if (!jobId || !description || !cv || !phoneno) {
        return res
          .status(400)
          .json({ message: "All fields including CV are required" });
      }

      if (!/^\d{10}$/.test(phoneno)) {
        return res
          .status(400)
          .json({ message: "Phone number must be exactly 10 digits" });
      }

      const job = await PostModel.findById(jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      // Check if user already applied for this job using email
      const alreadyApplied = job.userApply.some((app) => app.email === email);

      if (alreadyApplied) {
        return res.status(403).json({
          message:
            "You have already applied for this job. Multiple applications are not allowed.",
        });
      }

      // Add application
      job.userApply.push({ username, email, cv, description, phoneno });
      await job.save();

      // Add job to user's applied list
      const user = await UserModel.findOne({ email });
      if (user) {
        await UserModel.findByIdAndUpdate(user._id, {
          $addToSet: { applyJob: job._id },
        });
      }

      res.status(200).json({ message: "Job applied successfully" });
    } catch (err) {
      console.error("Error in user job apply:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async userProfilePage(req, res) {
    const userId = req.user.userid;
    console.log(userId);
    try {
      const response = await UserModel.findById(userId);
      if (!response) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(response);
    } catch (err) {
      console.log(`Error in user profile page ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async userProfileEdit(req, res) {
    const userId = req.user.userid; // user id from token
    const { username, location, preference, lookingFor, email } = req.body;

    try {
      // Update user document
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { username, location, preference, lookingFor, email },
        { new: true } // return updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res
        .status(200)
        .json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
      console.log(`Error in user edit ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  // PUT /job/userProfileEdit
  async userProfilePicEdit(req, res) {
    const userId = req.user.userid;

    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Get the path of the uploaded file
      const profilePicPath = `/uploads/${req.file.filename}`;

      // Update user's profilePic in the database
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        { profilePic: profilePicPath },
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile picture updated successfully",
        profilePic: updatedUser.profilePic,
      });
    } catch (err) {
      console.log(`Error in user profile pic edit: ${err}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default UserController;
