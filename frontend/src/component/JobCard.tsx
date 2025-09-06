import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";

interface Job {
  _id?: string;
  title?: string;
  description?: string;
  location?: string;
  industry?: string;
  requiredSkills?: string[];
}

const JobCard = ({
  job,
  onView,
}: {
  job: Job;
  onView: (id?: string) => void;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { y: 20, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-blue-800">{job.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              📍 {job.location || "Remote"}
            </p>
          </div>
          <div className="text-sm text-gray-400">{job.industry}</div>
        </div>

        <p className="text-gray-700 text-sm flex-1">
          {job.description
            ? job.description.length > 140
              ? job.description.slice(0, 140) + "..."
              : job.description
            : "No description"}
        </p>

        <div className="mt-4 flex gap-2 flex-wrap">
          {job.requiredSkills?.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Full-width button */}
      <button
        onClick={() => navigate(`/user/view/${job?._id}`)}
        className="w-full px-4 py-3 bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
      >
        View Details
      </button>
    </div>
  );
};

export default JobCard;
