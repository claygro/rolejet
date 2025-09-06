import Connection from "@/config/Connection.config";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
const JobPosts = () => {
  const [jobData, setJobData] = useState({});
  interface Token {
    name: string;
    email: string;
  }
  const [tokenData, setTokenData] = useState<Token | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };
  const token = async () => {
    const cookieData = await Connection.get("/job/companyToken");
    const data = jwtDecode<Token>(cookieData.data);
    setTokenData(data);
  };

  useEffect(() => {
    token();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Connection.post("/job/postJob", {
        ...jobData,
        email: tokenData?.email,
      });
      (e.target as HTMLFormElement).reset();
      toast.success("Job posted successfully!");
    } catch (err) {
      console.log(`error in posting job ${err}`);
    }
  };
  return (
    <div className="max-w-2xl mx-auto ">
      <h2 className="text-2xl font-bold text-zinc-700 mb-6">Post a Job</h2>
      <Toaster />
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-xl p-6"
      >
        {/* Job Title */}
        <div className="flex flex-col">
          <label
            htmlFor="job-title"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Job Title
          </label>
          <input
            type="text"
            name="title"
            onChange={handleChange}
            id="job-title"
            placeholder="Example Frontend Developer"
            required
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Description */}
        <div className="flex flex-col">
          <label
            htmlFor="job-description"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Job Description
          </label>
          <textarea
            required
            onChange={handleChange}
            name="description"
            id="job-description"
            placeholder="Write job description here..."
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        {/* required skills */}
        <div className="flex flex-col">
          <label
            htmlFor="requiredSkills"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Skills required
          </label>
          <input
            type="text"
            name="requiredSkills"
            onChange={handleChange}
            id="requiredSkills"
            placeholder="React, nodejs..."
            required
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="experience"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Experience
          </label>
          <input
            type="text"
            name="experience"
            onChange={handleChange}
            id="experience"
            placeholder="5 years of experience in ..."
            required
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Role */}
        <div className="flex flex-col">
          <label
            htmlFor="job-role"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Role
          </label>
          <input
            required
            onChange={handleChange}
            name="role"
            type="text"
            id="job-role"
            placeholder="Example senior Frontend developer"
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Type (Full time / Part time / Internship) */}
        <div className="flex flex-col">
          <label
            htmlFor="job-type"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Job Type
          </label>
          <input
            required
            onChange={handleChange}
            name="jobType"
            type="text"
            id="job-type"
            placeholder="Example Full-time"
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location (Remote / Onsite / Hybrid) */}
        <div className="flex flex-col">
          <label
            htmlFor="job-location"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            required
            onChange={handleChange}
            name="location"
            type="text"
            id="job-location"
            placeholder="Example Kathmandu, Nepal"
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Work Mode (Remote / Onsite / Hybrid) */}
        <div className="flex flex-col">
          <label
            htmlFor="job-work-mode"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Work Mode
          </label>
          <input
            required
            onChange={handleChange}
            name="workMode"
            type="text"
            id="job-work-mode"
            placeholder="Example Remote"
            className="border border-gray-300 text-gray-800 placeholder-gray-400 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-700 text-white px-5 py-2 rounded-md hover:bg-blue-800 transition"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPosts;
