import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Connection from "@/config/Connection.config";
import JobCard from "../component/JobCard";

interface Job {
  _id?: string;
  title?: string;
  description?: string;
  location?: string;
  industry?: string;
  requiredSkills?: string[];
  workMode?: string;
  jobType?: string;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read search params from URL
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [workMode, setWorkMode] = useState(
    searchParams.get("workMode") || "all"
  );

  // Fetch jobs whenever search params change
  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, location, category, workMode]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const categoryMap: any = {
        fulltime: "Full Time",
        parttime: "Part Time",
        internship: "Internship",
      };
      const workModeMap: any = {
        remote: "Remote",
        onsite: "Onsite",
        hybrid: "Hybrid",
      };

      const normalizedCategory =
        categoryMap[category.toLowerCase()] || category;
      const normalizedWorkMode =
        workModeMap[workMode.toLowerCase()] || workMode;

      // Build params dynamically: include location only if provided
      const params: any = {
        query,
        category: normalizedCategory,
        workMode: normalizedWorkMode,
      };
      if (location.trim()) params.location = location;

      const res = await Connection.get("/job/jobs/search", { params });
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    // Update URL query params when user clicks search
    const params: any = { query, location, category, workMode };
    const queryString = new URLSearchParams(params).toString();
    navigate(`/user/jobs?${queryString}`);
  };

  const handleView = (id?: string) => {
    if (!id) return;
    navigate(`/job/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6">
      {/* Filters */}
      <div className="bg-white shadow-md border border-gray-200 rounded-xl p-6 max-w-7xl mx-auto flex flex-wrap gap-4">
        <input
          placeholder="Keyword"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="flex-1 min-w-[150px] px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        >
          <option value="all">All Categories</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
          <option value="internship">Internship</option>
        </select>
        <select
          value={workMode}
          onChange={(e) => setWorkMode(e.target.value)}
          className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        >
          <option value="all">Any Work Mode</option>
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <button
          onClick={handleSearchClick}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition w-full md:w-auto"
        >
          Search
        </button>
      </div>

      {/* Jobs Grid */}
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="text-center text-gray-500 col-span-full py-20">
            Loading jobs...
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-500 col-span-full py-20">
            No jobs found.
          </div>
        ) : (
          jobs.map((job) => (
            <JobCard key={job._id} job={job} onView={handleView} />
          ))
        )}
      </div>
    </div>
  );
};

export default JobsPage;
