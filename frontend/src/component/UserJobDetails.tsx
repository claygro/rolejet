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
  const [phoneno, setPhoneno] = useState("");
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

    if (!phoneno || !description || !cv) {
      toast("❌ All fields are required");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("jobId", id || "");
      formData.append("phoneno", phoneno);
      formData.append("description", description);
      formData.append("image", cv);

      const res = await Connection.post("/job/userJobApply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast(res.data.message || "✅ Applied successfully!");

      // Reset form
      setPhoneno("");
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
    <div className="max-w-4xl mx-auto  space-y-4">
      <Toaster position="top-right" />

      {/* Company Header */}
      {jobView?.company?.map((comp) => (
        <div
          key={comp._id}
          className="flex flex-col gap-2 bg-blue-900 text-white rounded-lg p-3 shadow-md w-full"
        >
          {comp?.image && (
            <img
              src={`http://localhost:8000${comp.image}`}
              alt="Company logo"
              className="w-32 h-32 object-cover border-2 border-white shadow-md mx-auto"
            />
          )}
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-1">{comp?.name}</h1>
            <p
              onClick={() => copyEmail(comp?.email)}
              className="text-blue-200 underline cursor-pointer hover:text-white transition text-sm"
            >
              {comp?.email}
            </p>
            <p className="text-gray-200 mt-1 text-sm">{comp?.location}</p>
          </div>
        </div>
      ))}

      {/* Job Info */}
      <div className="bg-white shadow-md rounded-lg p-3 space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Job Details
        </h2>

        <div className="space-y-1 text-sm">
          <div className="p-2 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600">Work Mode</p>
            <p className="text-blue-800 font-medium">
              {jobView?.workMode || "N/A"}
            </p>
          </div>

          <div className="p-2 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600">Job Type</p>
            <p className="text-blue-800 font-medium">
              {jobView?.jobType || "N/A"}
            </p>
          </div>

          <div className="p-2 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600">Location</p>
            <p className="text-blue-800 font-medium">
              {jobView?.location || "N/A"}
            </p>
          </div>

          <div className="p-2 bg-blue-50 border-l-4 border-blue-600 rounded">
            <p className="text-gray-600">Job Experience</p>
            <p className="text-blue-800 font-medium">
              {jobView?.experience || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-3">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            Job Description
          </h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {jobView?.description || "No description available"}
          </p>
        </div>
      </div>

      {/* Job Apply Form */}
      <div className="bg-white shadow-md rounded-lg p-3 space-y-2">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Apply for this Job
        </h2>
        <form
          onSubmit={handleApply}
          className="space-y-2"
          encType="multipart/form-data"
        >
          {/* Phone Number */}
          <input
            type="text"
            placeholder="Enter your phone number"
            value={phoneno}
            onChange={(e) => setPhoneno(e.target.value)}
            className="px-3 py-1 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none w-full text-sm"
            required
          />

          {/* CV Upload */}
          <label
            htmlFor="cvUpload"
            className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors bg-gray-50 text-center text-sm"
          >
            {cv ? (
              <p className="text-gray-700 font-medium">{cv.name}</p>
            ) : (
              <p className="text-gray-400">
                Click or drag file here to upload CV
              </p>
            )}
            <input
              type="file"
              id="cvUpload"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              required
            />
          </label>

          {/* Description */}
          <textarea
            placeholder="Enter your description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-200 focus:outline-none text-sm"
            rows={3}
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
          >
            {loading ? "Applying..." : "Apply Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserJobDetails;
