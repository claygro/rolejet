import Connection from "@/config/Connection.config";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

interface Company {
  _id?: string;
  name?: string;
  email?: string;
  location?: string;
  image?: string;
}

interface Job {
  jobType?: string;
  description?: string;
  company: Company[];
  experience?: string;
  location?: string;
  workMode?: string;
}

const UserJobDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [jobView, setJobView] = useState<Job | null>(null);

  // Form state
  const [username, setUsername] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch job details
  useEffect(() => {
    async function viewJob() {
      try {
        const response = await Connection.post(`/job/userJobDetails/${id}`);
        setJobView(response.data?.job);
      } catch (err) {
        console.error("Error fetching job details:", err);
      }
    }
    viewJob();
  }, [id]);

  // Copy email to clipboard
  const copyEmail = async (email: string | undefined) => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      toast("✅ Email copied to clipboard");
    } catch (err) {
      console.error("Failed to copy email", err);
    }
  };

  // Handle file input
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCv(e.target.files[0]);
    }
  };

  // Handle form submit
  const handleApply = async (e: FormEvent) => {
    e.preventDefault();

    if (!username || !phoneno || !email || !description || !cv) {
      toast("❌ All fields are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("jobId", id || "");
      formData.append("username", username);
      formData.append("phoneno", phoneno);
      formData.append("email", email);
      formData.append("description", description);
      formData.append("image", cv);

      const res = await Connection.post("/job/userJobApply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast(res.data.message || "✅ Applied successfully!");

      // Reset form
      setUsername("");
      setPhoneno("");
      setEmail("");
      setDescription("");
      setCv(null);
    } catch (err: any) {
      console.error(err);
      toast(err.response?.data?.message || "❌ Failed to apply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <Toaster position="top-right" />

      {/* Company Header */}
      {jobView?.company?.map((comp) => (
        <div
          key={comp._id}
          className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 bg-blue-900 text-white rounded-lg p-6 shadow-lg mb-6 w-full"
        >
          <div className="w-40 flex-shrink-0">
            {comp?.image && (
              <img
                src={`http://localhost:8000${comp.image}`}
                alt="Company logo"
                className="w-40 h-40 object-cover border-4 border-white shadow-md"
              />
            )}
          </div>

          <div className="flex-1 sm:text-left">
            <h1 className="text-3xl font-bold mb-2">{comp?.name}</h1>
            <p
              onClick={() => copyEmail(comp?.email)}
              className="text-blue-200 underline cursor-pointer hover:text-white transition"
            >
              {comp?.email}
            </p>
            <p className="text-gray-200 mt-1">{comp?.location}</p>
          </div>
        </div>
      ))}

      {/* Job Info */}
      <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Job Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600 text-sm">Work Mode</p>
            <p className="text-lg font-medium text-blue-800">
              {jobView?.workMode || "N/A"}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600 text-sm">Job Type</p>
            <p className="text-lg font-medium text-blue-800">
              {jobView?.jobType || "N/A"}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600 text-sm">Location</p>
            <p className="text-lg font-medium text-blue-800">
              {jobView?.location || "N/A"}
            </p>
          </div>

          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600 text-sm">Experience</p>
            <p className="text-lg font-medium text-blue-800">
              {jobView?.experience || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Job Description
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {jobView?.description || "No description available"}
          </p>
        </div>
      </div>

      {/* Job Apply Form */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Apply for this Job
        </h2>
        <form
          onSubmit={handleApply}
          className="space-y-4"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full"
              required
            />
            <input
              type="text"
              placeholder="Enter your phone number"
              value={phoneno}
              onChange={(e) => setPhoneno(e.target.value)}
              className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full"
              required
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full"
              required
            />
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="px-4 py-3 border rounded-lg border-gray-300 focus:outline-none w-full"
              required
            />
          </div>
          <textarea
            placeholder="Enter your description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Applying..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserJobDetails;
