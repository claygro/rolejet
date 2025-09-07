import { useNavigate } from "react-router-dom";

const AiMockInterviewQuestion = () => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-2">AI Mock Interview</h1>
      <p className="text-gray-600 mb-6">
        Practicing with AI mock interviews helps you build confidence, improve
        communication, and prepare for real interview scenarios. You’ll get a
        safe environment to practice answering questions and refine your
        responses before facing an actual interviewer. And this will go to HR
        and based on your rank they will call for interview.
      </p>
      <button
        onClick={() => navigate("/user/interview")}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Start Instant Interview
      </button>
    </div>
  );
};

export default AiMockInterviewQuestion;
