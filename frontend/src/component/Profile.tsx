import Connection from "@/config/Connection.config";
import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { RiDeleteBinFill } from "react-icons/ri";
const Profile = () => {
  interface Token {
    name: string;
    email: string;
  }

  interface Job {
    title: string;
    description: string;
    location: string;
    jobType: string;
    workMode: string;
    requiredSkills: string;
    experience: string;
    _id: string;
  }

  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState<Token | null>(null);
  const [jobPost, setJobPost] = useState<Job[]>([]);
  const [companyDetails, setCompanyDetails] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const token = async () => {
    const cookieData = await Connection.get("/job/companyToken");
    const data = jwtDecode<Token>(cookieData.data);
    setTokenData(data);
  };

  const fetchJob = async () => {
    if (!tokenData?.email) return;
    const response = await Connection.post("/job/getCompanyJob", {
      email: tokenData.email,
    });
    setJobPost(response.data.reverse());
  };

  const company = async () => {
    try {
      const response = await Connection.post("/job/companyDetails", {
        email: tokenData?.email,
      });
      setCompanyDetails(response.data);
    } catch (err) {
      console.log(`error in getting company ${err}`);
    }
  };

  useEffect(() => {
    token();
  }, []);

  useEffect(() => {
    fetchJob();
    company();
  }, [tokenData]);

  // Handle file input change
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await Connection.put(
        "/job/companyUpdateProfilePic",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setCompanyDetails((prev: any) => ({
        ...prev,
        image: res.data.image,
      }));

      toast.success("Profile picture updated successfully!");
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to update profile pic"
      );
    }
  };
  //delete functionality.
  const handleDelete = async (id: any) => {
    try {
      await Connection.delete(`/job/jobDelete/${id}`);
      setJobPost(jobPost.filter((job) => job._id !== id));
    } catch (err) {
      console.log(`Error in deleting the job ${err}`);
    }
  };
  return (
    <>
      <Toaster />
      <div className="bg-white px-4 py-5 rounded-xl mb-2 flex items-center gap-5">
        <img
          src={`http://localhost:8000${companyDetails?.image}`}
          className="w-12 h-12 rounded-full cursor-pointer"
          alt="Profile"
          onClick={() => fileInputRef.current?.click()}
        />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />
        <h1>{tokenData?.name}</h1>
      </div>

      <div className="mx-auto flex-1 bg-white rounded-xl shadow-md p-6 min-h-[800px]">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Company Jobs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobPost.map((job) => (
            <div
              key={job?._id}
              className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between hover:shadow-2xl transition duration-300"
            >
              <div className="flex justify-end ">
                <button
                  className="cursor-pointer"
                  onClick={() => handleDelete(job?._id)}
                >
                  <RiDeleteBinFill className="text-2xl text-red-500" />
                </button>
              </div>
              <h2 className="text-lg font-bold text-zinc-800 mb-2 truncate">
                {job?.title}
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {job.description.slice(0, 20) + "......"}
              </p>
              <div className="text-gray-700 space-y-1">
                <p>
                  {" "}
                  <span className="font-semibold text-gray-800">
                    Skills:
                  </span>{" "}
                  {job?.requiredSkills}
                </p>
                <p>
                  {" "}
                  <span className="font-semibold text-gray-800">
                    Experience:
                  </span>{" "}
                  {job?.experience}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Location:</span>{" "}
                  {job?.location}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">Job Type:</span>{" "}
                  {job?.jobType}
                </p>
                <p>
                  <span className="font-semibold text-gray-800">
                    Work Mode:
                  </span>{" "}
                  {job.workMode}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate(`/companyDashboard/jobDetail/${job._id}`)
                }
                className="mt-4 bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
