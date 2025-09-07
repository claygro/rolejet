import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Connection from "@/config/Connection.config";

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

const JobDetails = () => {
  const { id } = useParams<{ id: string }>(); // Get job ID from URL
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await Connection.get(`/job/jobDetail/${id}`); // Fetch job details by ID
        setJob(response.data);
      } catch (err) {
        console.error("Error fetching job details:", err);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (!job) {
    return <p>Loading job details...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">{job?.title}</h1>
      <p className="text-gray-700 mb-4">{job?.description}</p>
      <p>
        <span className="font-semibold">Skills:</span> {job?.requiredSkills}
      </p>
      <p>
        <span className="font-semibold">Experience:</span> {job?.experience}
      </p>
      <p>
        <span className="font-semibold">Location:</span> {job?.location}
      </p>
      <p>
        <span className="font-semibold">Job Type:</span> {job?.jobType}
      </p>
      <p>
        <span className="font-semibold">Work Mode:</span> {job?.workMode}
      </p>
    </div>
  );
};

export default JobDetails;
