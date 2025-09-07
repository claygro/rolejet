import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import Connection from "@/config/Connection.config";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const jobTitles = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Flutter Developer",
  "React Developer",
  "Node.js Developer",
  "UI/UX Designer",
  "Data Scientist",
  "Cyber Security Researcher",
];

const jobTypes = ["Full-time", "Part-time", "Internship", "Contract"];
const experienceLevels = [
  { label: "Beginner / 1–2 years", value: "Beginner" },
  { label: "Intermediate / 3–5 years", value: "Intermediate" },
  { label: "Senior / 5+ years", value: "Senior" },
];

const JobPosts = () => {
  const [jobData, setJobData] = useState<any>({});
  const [tokenData, setTokenData] = useState<any>(null);
  const [jobTitleInput, setJobTitleInput] = useState("");
  const [jobTypeInput, setJobTypeInput] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const fetchToken = async () => {
    const cookieData = await Connection.get("/job/companyToken");
    const data = jwtDecode(cookieData.data);
    setTokenData(data);
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await Connection.post("/job/postJob", {
        ...jobData,
        email: tokenData?.email,
      });
      (e.target as HTMLFormElement).reset();
      setJobTitleInput("");
      setJobTypeInput("");
      toast.success("Job posted successfully!");
    } catch (err: any) {
      console.log("Error posting job:", err);
      toast.error(err?.response?.data?.message || "Failed to post job");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Toaster />
      <h2 className="text-2xl font-bold text-zinc-700 mb-6">Post a Job</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white shadow-md rounded-xl p-6"
      >
        {/* Job Title */}
        <div className="flex flex-col">
          <label className="mb-1">Job Title</label>
          <input
            list="job-titles"
            name="title"
            value={jobTitleInput}
            onChange={(e) => {
              setJobTitleInput(e.target.value);
              handleChange(e);
            }}
            placeholder="Select or type job title..."
            required
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="job-titles">
            {jobTitles.map((title) => (
              <option key={title} value={title} />
            ))}
          </datalist>
        </div>

        {/* Job Type */}
        <div className="flex flex-col">
          <label className="mb-1">Job Type</label>
          <select
            name="jobType"
            value={jobTypeInput}
            onChange={(e) => {
              setJobTypeInput(e.target.value);
              handleChange(e);
            }}
            required
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Job Type</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Experience */}
        <div className="flex flex-col">
          <label className="mb-1">Experience Level</label>
          <select
            name="experience"
            onChange={handleChange}
            required
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Experience</option>
            {experienceLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="mb-1">Job Description</label>
          <textarea
            name="description"
            onChange={handleChange}
            placeholder="Write job description..."
            required
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        </div>

        {/* Skills */}
        <div className="flex flex-col">
          <label className="mb-1">Skills (comma separated)</label>
          <input
            type="text"
            name="requiredSkills"
            onChange={handleChange}
            placeholder="React, Node.js..."
            required
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="mb-1">Location</label>
          <input
            type="text"
            name="location"
            onChange={handleChange}
            placeholder="Example Kathmandu"
            required
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Work Mode */}
        <div className="flex flex-col">
          <label className="mb-1">Work Mode</label>
          <input
            type="text"
            name="workMode"
            onChange={handleChange}
            placeholder="Remote, Onsite..."
            required
            className="border px-2 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
