import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Connection from "@/config/Connection.config";
import JobCard from "../component/JobCard";

interface Job {
  _id?: string;
  title?: string;
  description?: string;
  location?: string;
  industry?: string;
  requiredSkills?: string[];
}

const UserPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await Connection.get("/job/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    navigate(`/user/jobs?query=${query}`);
  };

  const handleView = (id?: string) => {
    if (!id) return;
    navigate(`/job/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs by title, skills..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs
            .slice()
            .reverse()
            .map((job) => (
              <JobCard key={job._id} job={job} onView={handleView} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserPage;
