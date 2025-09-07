import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Connection from "../config/Connection.config";
import signupBgImage from "../images/authImage.png";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
function SignupForm() {
  const navigate = useNavigate();
  const [loginUserData, setLoginUserData] = useState({});

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginUserData({ ...loginUserData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const userRegistration = localStorage.getItem("userRegistration");
    if (userRegistration && JSON.parse(userRegistration) == true) {
      navigate("/user");
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Connection.post("/job/login", { ...loginUserData });
      (e.target as HTMLFormElement).reset();

      navigate("/user");
      localStorage.setItem("userRegistration", JSON.stringify(true));
    } catch (err) {
      console.log(`Error in submitting form: ${err.response.data.message}`);
      toast.error(err.response.data.message);
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
      className="min-h-screen  flex justify-center items-center p-4"
    >
      <div className="fixed top-10 right-10">
        <NavLink to="/company">
          <button>Company Register?</button>
        </NavLink>
      </div>
      <Toaster />

      <div className=" bg-white   w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">User Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5 ">
          <div className="flex flex-col">
            <label className="mb-2 font-medium ">Email</label>
            <input
              name="email"
              type="email"
              onChange={handleOnChange}
              required
              placeholder="Enter your email"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col">
            <label className="mb-2 font-medium ">Password</label>
            <input
              name="password"
              type="password"
              onChange={handleOnChange}
              placeholder="Enter your password"
              required
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <div>
          <NavLink to="/">
            <button> have an account?singup?</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
