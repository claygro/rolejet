import signupBgImage from "../images/authImage.png";
import { NavLink } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import Connection from "@/config/Connection.config";
import { useNavigate } from "react-router-dom";
const LoginCompany = () => {
  const [loginCompanyData, setLoginCompanyData] = useState({});

  const navigate = useNavigate();
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginCompanyData({
      ...loginCompanyData,
      [e.target.name]: e.target.value,
    });
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
      await Connection.post("/job/companyLogin", {
        ...loginCompanyData,
      });
      (e.target as HTMLFormElement).reset();
      navigate("/companyDashboard");
      localStorage.setItem("companyRegister", JSON.stringify(true));
    } catch (err: unknown) {
      console.log((err as any).response.data.message);
      toast.error((err as any).response.data.message);
    }
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
        className="min-h-screen  flex justify-center items-center p-4"
      >
        <div className="fixed top-10 right-10">
          <NavLink to="/">
            <button>User Register?</button>
          </NavLink>
        </div>
        <Toaster />
        <div className=" bg-white   w-full max-w-md p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">Company Login</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col">
              <label className="mb-2 font-medium "> Email</label>
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
              <label className="mb-2 font-medium "> Password</label>
              <input
                name="password"
                type="password"
                onChange={handleOnChange}
                placeholder="Enter your password"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
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
            <button onClick={() => navigate("/company")}>
              don't have account? Signup?
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginCompany;
