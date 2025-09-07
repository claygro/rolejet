import { useState } from "react";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    if (otp === "123456") {
      toast.success("OTP Verified!");
      localStorage.setItem("userRegistration", JSON.stringify(true));
      navigate("/user/userHome");
    } else {
      toast.success("Wrong otp!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <Toaster />
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded mb-4"
        />
        <button
          onClick={handleVerify}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default VerifyOtp;
