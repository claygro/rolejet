import { useEffect, useState } from "react";
import Connection from "@/config/Connection.config";
import { Toaster, toast } from "sonner";
import { Trash2 } from "lucide-react"; // Import delete icon from lucide-react

interface Applicant {
  username: string;
  description: string;
  appliedAt: string;
  _id: string;
}

interface Job {
  _id: string;
  title: string;
  userApply: Applicant[];
}

const Analytics = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null
  );

  // Fetch applicants
  useEffect(() => {
    async function fetchApplicants() {
      try {
        const res = await Connection.get("/job/jobApplicants");
        setJobs(res.data.jobs);
      } catch (err: any) {
        console.error(err);
        toast.error("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    }
    fetchApplicants();
  }, []);

  // Delete applicant function
  const handleDeleteApplicant = async (applicantId: string, jobId: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this applicant?"
    );
    if (!confirmDelete) return;

    toast.promise(
      Connection.delete(`/job/deleteApplicants/${applicantId}`, {
        data: { jobId },
      }),
      {
        loading: "Deleting applicant...",
        success: (res: any) => {
          // Update frontend state
          setJobs((prevJobs) =>
            prevJobs.map((job) =>
              job._id === jobId
                ? {
                    ...job,
                    userApply: job.userApply.filter(
                      (a) => a._id !== applicantId
                    ),
                  }
                : job
            )
          );

          if (selectedApplicant?._id === applicantId) {
            setSelectedApplicant(null);
          }

          return res.data.message || "Applicant deleted successfully";
        },
        error: "Failed to delete applicant",
      }
    );
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Applications Analytics</h1>
        <p className="mb-6 text-gray-600">
          View and analyze your job applications here.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-gray-500">No applications yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{job.title}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {job.userApply
                  .slice()
                  .reverse()
                  .map((app) => (
                    <div
                      key={app._id}
                      className="bg-white shadow-md rounded-lg p-4 hover:shadow-xl transition cursor-pointer relative"
                      onClick={() => setSelectedApplicant(app)}
                    >
                      <h3 className="text-lg font-bold text-blue-700 mb-2">
                        {app.username}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {app.description.slice(0, 30) ||
                          "No description provided"}
                      </p>
                      <div className="mt-2 text-xs text-gray-400">
                        Applied on:{" "}
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </div>

                      {/* Delete icon */}
                      <button
                        className="absolute top-2 right-2 text-red-600 hover:text-red-800 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteApplicant(app._id, job._id);
                        }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}

        {/* Modal for selected applicant */}
        {selectedApplicant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedApplicant(null)}
              >
                ✕
              </button>
              <h3 className="text-xl font-bold mb-2">
                {selectedApplicant.username}
              </h3>
              <p className="text-gray-700 mb-4">
                {selectedApplicant.description}
              </p>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                disabled
              >
                Download CV (Coming Soon)
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Analytics;
