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
      className="relative bg-white rounded-4xl p-8 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 hover:scale-105 transition-all cursor-pointer overflow-hidden"
    >
      {/* Decorative background circles */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-ping"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-pulse"></div>

      {/* Job Content */}
      <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2 hover:text-blue-700 transition-colors">
        {job.title}
      </h3>
      {job.industry && (
        <p className="text-gray-600 mb-1 font-semibold">{job.industry}</p>
      )}
      <p className="text-gray-600 mb-1">📍 {job.location || "Remote"}</p>
      {job.requiredSkills && (
        <div className="flex flex-wrap gap-2 mb-4 mt-2">
          {job.requiredSkills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-700 mb-6 line-clamp-3">
        {job.description
          ? job.description.length > 140
            ? job.description.slice(0, 140) + "..."
            : job.description
          : "No description"}
      </p>

      {/* Action Button */}
      <button
        onClick={() => navigate(`/user/view/${job?._id}`)}
        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold shadow-lg transform hover:scale-105 transition-transform duration-300 py-3 rounded-xl"
      >
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
