import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Connection from "../config/Connection.config";
import signupBgImage from "../images/authImage.png";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { NavLink, useNavigate } from "react-router-dom";
function SignupForm() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const userRegister = localStorage.getItem("userRegister");
  });
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Connection.post("/job/signup", { ...userData });
      (e.target as HTMLFormElement).reset();

      navigate("/userProfile");
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
          <button className="bg-blue-700 px-4 py-2 text-white rounded-xl cursor-pointer">
            Company Register
          </button>
        </NavLink>
      </div>
      <Toaster position="top-center" />

      <div className=" bg-white   w-full max-w-md p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">User Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-5 ">
          <div className="flex flex-col">
            <label className="mb-2 font-medium ">Fullname</label>
            <input
              name="username"
              type="text"
              onChange={handleOnChange}
              placeholder="Enter your username"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
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
          <div className="flex flex-col">
            <label className="mb-2 font-medium ">Confirm Password</label>
            <input
              name="conformPassword"
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
            Signup
          </button>
        </form>
        <div>
          <NavLink to="/userLogin">
            <button>Already have an account?login?</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default SignupForm;
