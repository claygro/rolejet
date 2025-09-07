import signupBgImage from "../images/authImage.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Connection from "@/config/Connection.config";

const CompanyForm = () => {
  const [companyData, setCompanyData] = useState<Record<string, string>>({});
  const [imageData, setImageData] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const companyRegister = localStorage.getItem("companyRegister");
    if (companyRegister && JSON.parse(companyRegister) === true) {
      navigate("/companyDashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append all companyData fields
      Object.entries(companyData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append image
      if (imageData) {
        formData.append("image", imageData);
      }

      await Connection.post("/job/companySignup", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      (e.target as HTMLFormElement).reset();
      navigate("/companyDashboard");
      localStorage.setItem("companyRegister", JSON.stringify(true));
    } catch (err: any) {
      console.log(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageData(e.target.files ? e.target.files[0] : null);
  };

  return (
    <>
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
        <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Company Signup
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label className="mb-2 font-medium">Company Logo</label>
              <input type="file" onChange={handleImageChange} />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-medium">Company Name</label>
              <input
                name="name"
                type="text"
                onChange={handleOnChange}
                placeholder="Enter your company name"
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
                placeholder="Enter your email"
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
                placeholder="Enter your password"
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
                required
                placeholder="Enter your industry"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-medium">Location</label>
              <input
                name="location"
                type="text"
                onChange={handleOnChange}
                placeholder="Enter your location"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Signup
            </button>
          </form>
          <div>
            <button onClick={() => navigate("/loginCompany")}>
              Already have account? Login?
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyForm;
