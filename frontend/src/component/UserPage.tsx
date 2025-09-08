import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Connection from "@/config/Connection.config";
import JobCard from "../component/JobCard";
import { X } from "lucide-react";

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
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    const stored = localStorage.getItem("showWelcome");
    return stored !== "false";
  });
  const [userName, setUserName] = useState("");
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

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await Connection.get("/job/userProfilePage");
        setUserName(response.data?.username);
      } catch (err) {
        console.log(`Error in user fetch data ${err}`);
      }
    }
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen font-sans bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Hero / Search Section */}
      <section className="relative bg-gradient-to-r from-indigo-200 via-cyan-200 to-blue-100 p-16 md:p-24 flex flex-col items-center rounded-b-5xl shadow-2xl overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-bounce"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-center text-gray-900 drop-shadow-lg">
          Discover Your Next Career Move
        </h2>
        <p className="text-gray-700 mb-8 md:mb-12 text-center text-lg md:text-xl max-w-3xl drop-shadow-md">
          Search thousands of jobs from top companies and find the perfect match
          for your skills and aspirations.
        </p>
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-4 shadow-2xl rounded-full overflow-hidden border border-gray-300">
          <input
            placeholder="Search jobs by title, skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-none focus:ring-0 py-4 md:py-5 px-6 md:px-8 text-lg md:text-xl font-semibold rounded-full"
          />
          <button
            onClick={handleSearch}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-700 hover:to-blue-800 text-white px-6 md:px-10 py-4 md:py-5 font-bold shadow-2xl rounded-full transform hover:scale-105 transition-transform duration-300"
          >
            Search
          </button>
        </div>
      </section>

      {/* Job Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {jobs
          .slice()
          .reverse()
          .map((job) => (
            <JobCard key={job._id} job={job} onView={handleView} />
          ))}
      </div>

      {/* Welcome Popup */}
      {showWelcome && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white shadow-2xl rounded-xl p-6 w-80 md:w-96 z-50 flex flex-col items-start gap-3 border-l-4 border-blue-500 animate-fadeIn">
          <div className="flex justify-between w-full items-start">
            <h2 className="text-xl font-bold text-gray-800">
              Welcome {userName}
            </h2>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => {
                setShowWelcome(false);
                localStorage.setItem("showWelcome", "false");
              }}
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-gray-600 text-sm">
            Explore the latest job opportunities and find the best match for
            your skills. Start your career journey today!
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPage;
