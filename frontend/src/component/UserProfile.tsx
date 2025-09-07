import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Connection from "../config/Connection.config";
import signupBgImage from "../images/authImage.png";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    age: "",
    experience: "",
    lookingFor: "",
    available: "",
    preference: "",
    location: "",
  });
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePic(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  useEffect(() => {
    const user: any = localStorage.getItem("userRegistration");
    if (JSON.parse(user || "false") === true) {
      navigate("/user/userHome");
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(profileData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      if (profilePic) formData.append("profilePic", profilePic);

      await Connection.put("/job/setup-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("user", JSON.stringify(true));
      toast.success("Profile updated successfully!");
      localStorage.setItem("userRegistration", JSON.stringify(true));
      navigate("/user/userHome");
    } catch (err: any) {
      console.log(
        "Error in submitting form:",
        err?.response?.data?.message || err.message
      );
      toast.error(err?.response?.data?.message || "Something went wrong");
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
      <Toaster />
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>

        {/* Profile Picture Preview (Clickable) */}
        <div className="flex justify-center mb-6">
          <label htmlFor="profilePicInput" className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                No Image
              </div>
            )}
          </label>
          {/* Hidden file input */}
          <input
            id="profilePicInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Grid Layout for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col">
              <label className="mb-2 font-medium">Age</label>
              <input
                name="age"
                type="number"
                value={profileData.age}
                onChange={handleOnChange}
                placeholder="Enter your age"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium">Experience</label>
              <input
                name="experience"
                type="text"
                value={profileData.experience}
                onChange={handleOnChange}
                placeholder="Enter your experience"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium">Looking for</label>
              <input
                name="lookingFor"
                type="text"
                value={profileData.lookingFor}
                onChange={handleOnChange}
                placeholder="Entry level, etc."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium">Available</label>
              <input
                name="available"
                type="text"
                value={profileData.available}
                onChange={handleOnChange}
                placeholder="Full time, part time"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium">Preferred Job</label>
              <input
                name="preference"
                type="text"
                value={profileData.preference}
                onChange={handleOnChange}
                placeholder="Frontend developer, etc."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-2 font-medium">Location</label>
              <input
                name="location"
                type="text"
                value={profileData.location}
                onChange={handleOnChange}
                placeholder="City, remote..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserProfile;
