import { Router } from "express";
import CompanyController from "../Controller/company.controller.js";
import upload from "../config/multer.config.js";
import companyAuth from "../Middleware/company.middleware.js";
import UserController from "../Controller/user.controller.js";
import userAuth from "../Middleware/user.middleware.js";
const router = Router();
const companyController = new CompanyController();
const userController = new UserController();

// Normal signup
// router.post("/signup", userController.signup);
router.post(
  "/companySignup",
  upload.single("image"),
  companyController.signupCompany
);
router.get("/companyToken", companyController.companyCookie);
router.post("/postJob", companyAuth, companyController.postJob);
router.post("/getCompanyJob", companyController.getCompanyJob);
router.get("/jobDetail/:id", companyAuth, companyController.getJobById);
router.post("/companyDetails", companyController.getCompanyDetails);
router.get("/logout", companyController.logout);
router.post("/companyLogin", companyController.loginCompany);
router.put(
  "/companyUpdateProfilePic",
  upload.single("image"), // handle single file upload
  companyController.updateProfilePic
);
router.put(
  "/companyUpdate",
  companyAuth,
  companyController.updateCompanyDetails
);
router.get(
  "/jobApplicants",
  companyAuth,
  companyController.getApplyJobApplicants
);
router.delete("/jobDelete/:id", companyController.deleteJob);
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.delete("/logout", userController.logout);

router.get("/jobs", userAuth, userController.getAllJobs);
router.get("/jobs/search", userAuth, userController.searchJobs);
router.put(
  "/setup-profile",
  upload.single("profilePic"),
  userAuth,
  userController.setupProfile
);
router.post("/userJobDetails/:id", userAuth, userController.userJobDetail);
router.post(
  "/userJobApply",
  upload.single("image"),
  userAuth,
  userController.userJobApply
);
router.delete(
  "/deleteApplicants/:id",
  companyAuth,
  companyController.deleteApplicants
);
router.get("/userProfilePage", userAuth, userController.userProfilePage);
router.put("/userProfileEdit", userAuth, userController.userProfileEdit);
router.put(
  "/userProfilePicEdit",
  userAuth,
  upload.single("image"),
  userController.userProfilePicEdit
);
router.get("/getCookie", userAuth, userController.getCookie);
export default router;
