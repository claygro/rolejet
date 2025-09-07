import signupBgImage from "../images/authImage.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Connection from "@/config/Connection.config";

const CompanyForm = () => {
  const [companyData, setCompanyData] = useState<Record<string, string>>({});
  const [logoImage, setLogoImage] = useState<File | null>(null);
  const [previewLogo, setPreviewLogo] = useState<string>("");
  const navigate = useNavigate();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoImage(e.target.files[0]);
      setPreviewLogo(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Email validation
    const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
    const emailDomain = (companyData.email || "").split("@")[1];
    if (!allowedDomains.includes(emailDomain)) {
      toast.error("Email must be a valid Gmail, Yahoo, or Outlook address.");
      return;
    }

    // Password validation
    const password = companyData.password || "";
    const confirmPassword = companyData.confirmPassword || "";
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include one special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(companyData).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (logoImage) formData.append("image", logoImage);

      await Connection.post("/job/companySignup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Company registered successfully!");
      localStorage.setItem("companyRegister", "true");
      navigate("/companyDashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${signupBgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      className="min-h-screen flex justify-center items-center p-4"
    >
      <div className="fixed top-10 right-10">
        <NavLink to="/">
          <button className="bg-blue-700 px-4 py-2 text-white rounded-xl cursor-pointer">
            User Register?
          </button>
        </NavLink>
      </div>
      <Toaster />
      <div className="bg-white w-full max-w-xl p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Company Signup</h2>

        {/* Logo Upload */}
        <div className="flex justify-center mb-6">
          <label
            htmlFor="logoUpload"
            className="w-32 h-32 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500 transition-colors bg-gray-50"
          >
            {previewLogo ? (
              <img
                src={previewLogo}
                alt="Logo Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-center text-sm">
                Click to upload
              </span>
            )}
            <input
              type="file"
              id="logoUpload"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
              required
            />
          </label>
        </div>

        {/* Form Fields Side by Side */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="flex flex-col col-span-2">
            <label className="mb-2 font-medium">Company Name</label>
            <input
              name="name"
              type="text"
              onChange={handleOnChange}
              placeholder="Company Name"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleOnChange}
              placeholder="Email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleOnChange}
              placeholder="Password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              onChange={handleOnChange}
              placeholder="Confirm Password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium">Industry</label>
            <input
              name="industry"
              type="text"
              onChange={handleOnChange}
              placeholder="Industry"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
              focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="mb-2 font-medium">Location</label>
            <input
              name="location"
              type="text"
              onChange={handleOnChange}
              placeholder="Location"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Full-width submit button */}
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Signup
            </button>
          </div>
        </form>

        <div className="mt-4 text-center col-span-2">
          <NavLink to="/loginCompany">
            <button className="text-sm text-blue-600 hover:underline">
              Already have an account? Login
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default CompanyForm;
