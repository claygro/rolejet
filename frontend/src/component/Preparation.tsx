// RoleJetPreparationCenter.jsx
import React, { useState } from "react";

function JobCard({ job, onSelect }) {
  return (
    <div
      className="cursor-pointer p-4 rounded-lg shadow hover:shadow-md bg-white transition"
      onClick={() => onSelect(job)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg text-gray-800">{job.title}</h3>
          <p className="text-sm text-gray-500">
            {job.company} • {job.location}
          </p>
        </div>
        <div className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
          {job.level}
        </div>
      </div>
      <p className="mt-2 text-gray-700 text-sm line-clamp-3">{job.summary}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {job.skills?.slice(0, 5).map((s, i) => (
          <span
            key={i}
            className="bg-gray-100 px-2 py-1 rounded text-xs text-gray-800"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function JobPreview({ job }) {
  if (!job)
    return (
      <div className="p-6 text-gray-500">Select a job to preview details.</div>
    );

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
      <p className="text-sm text-gray-500 mt-1">
        {job.company} • {job.location} •{" "}
        <span className="font-medium">{job.level}</span>
      </p>

      <div className="mt-4 text-gray-800">
        <h4 className="font-semibold text-gray-700">Role Summary</h4>
        <p className="mt-1 text-gray-600">{job.summary}</p>

        <h4 className="font-semibold text-gray-700 mt-4">Skills</h4>
        <div className="mt-1 flex flex-wrap gap-2">
          {job.skills.map((s, i) => (
            <span
              key={i}
              className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-800"
            >
              {s}
            </span>
          ))}
        </div>

        <h4 className="font-semibold text-gray-700 mt-4">Practice Questions</h4>
        <ul className="list-disc pl-5 mt-1 text-gray-700 space-y-1 text-sm">
          {job.questions.map((q, i) => (
            <li key={i}>{q}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Save Prep Plan
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Start Mock Interview
        </button>
      </div>
    </div>
  );
}

export default function RoleJetPreparationCenter() {
  const sampleJobs = [
    {
      id: 1,
      title: "Frontend Engineer — React",
      company: "RoleJet",
      location: "Remote",
      level: "Mid",
      summary:
        "Build performant and accessible UI components, collaborate with product and backend teams to deliver features.",
      skills: ["React", "TypeScript", "CSS", "Testing", "Performance"],
      questions: [
        "Explain functional vs class components in React.",
        "How to optimize large React apps?",
        "What are React hooks and usage?",
        "How to manage state in large projects?",
        "Best practices for structuring React projects?",
      ],
    },
    {
      id: 2,
      title: "Backend Engineer — APIs",
      company: "RoleJet",
      location: "Kathmandu, Nepal",
      level: "Junior",
      summary:
        "Design and maintain RESTful APIs, write unit tests, and ensure observability.",
      skills: ["Node.js", "Express", "MongoDB", "Jest", "CI/CD"],
      questions: [
        "Difference between REST and GraphQL?",
        "How to secure an API endpoint?",
        "Explain middleware in Express.",
        "Handling database transactions in MongoDB?",
        "Strategies for scaling backend services?",
      ],
    },
  ];

  const [query, setQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState(sampleJobs[0]);

  const filteredJobs = sampleJobs.filter(
    (j) =>
      j.title.toLowerCase().includes(query.toLowerCase()) ||
      j.company.toLowerCase().includes(query.toLowerCase()) ||
      j.skills.join(" ").toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              RoleJet Preparation Center
            </h1>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs, skills or company"
              className="px-3 py-2 rounded border border-gray-200 w-64"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
            ))}
          </div>
        </div>

        <aside className="col-span-1 bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Live Preview</h3>
            <p className="text-sm text-gray-500 mt-1">
              See the full role summary, skills, and practice questions here.
            </p>
          </div>
          <JobPreview job={selectedJob} />
        </aside>
      </div>
    </div>
  );
}
