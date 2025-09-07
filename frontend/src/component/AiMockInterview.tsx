import React, { useRef, useState, useEffect } from "react";

const AIMockInterview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [recording, setRecording] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [aiAlerts, setAiAlerts] = useState<string[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);

  const questions: string[] = [
    "Explain the process of photosynthesis in detail.",
    "Describe the advantages of cloud computing.",
    "What is the difference between SQL and NoSQL databases?",
  ];

  // ✅ Ask for permissions
  const requestCameraPermission = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setCameraPermissionGranted(true);
      setMicOn(true);
      setStream(mediaStream);
      setAiAlerts((prev) => [...prev, "Camera & microphone access granted"]);
    } catch (err) {
      alert("Camera or microphone access denied!");
      console.error(err);
    }
  };

  // ✅ Attach stream to videoRef when available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.muted = true; // 🔇 prevent feedback
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
    }
  }, [stream]);

  // ✅ Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const toggleRecording = () => {
    setRecording((prev) => !prev);
    setAiAlerts((prev) => [
      ...prev,
      recording ? "Recording stopped" : "AI monitoring started",
    ]);
  };

  const toggleMic = () => {
    if (micOn && stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = false));
      setMicOn(false);
      setAiAlerts((prev) => [...prev, "Microphone turned off"]);
    } else if (stream) {
      stream.getAudioTracks().forEach((track) => (track.enabled = true));
      setMicOn(true);
      setAiAlerts((prev) => [...prev, "Microphone turned on"]);
    }
  };

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const updated = [...answers];
    updated[currentQuestion] = e.target.value;
    setAnswers(updated);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(300);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setTimeLeft(300);
    }
  };

  if (!cameraPermissionGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-2xl rounded-3xl w-full max-w-xl p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">
            Camera & Microphone Access Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please allow access to your camera and microphone to start the AI
            mock test.
          </p>
          <button
            onClick={requestCameraPermission}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Allow Camera & Mic
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-3xl w-full max-w-6xl p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Role Jet AI Mock Test
          </h1>
          <p className="text-gray-500 mt-2">
            Complete your job readiness test with AI proctoring.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Camera & AI Alerts */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="relative border border-gray-300 rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full rotate-y-180 h-64 object-cover"
                autoPlay
                playsInline
                muted
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-lg transition ${
                  recording
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </button>
              <button
                onClick={toggleMic}
                className={`px-4 py-2 rounded-lg transition ${
                  micOn
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-400 text-white hover:bg-gray-500"
                }`}
              >
                {micOn ? "Mic On" : "Mic Off"}
              </button>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 h-40 overflow-y-auto">
              <h3 className="font-semibold mb-2">AI Monitoring Alerts:</h3>
              <ul className="text-gray-700 list-disc list-inside">
                {aiAlerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question & Timer */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-gray-700">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <p className="text-gray-600">{questions[currentQuestion]}</p>
              <textarea
                value={answers[currentQuestion]}
                onChange={handleAnswerChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2"
                rows={5}
                placeholder="Type your answer here..."
              />
              <p className="text-right text-gray-500 mt-1">
                Time Left: {timeLeft}s
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Previous
              </button>
              <button
                onClick={nextQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>

            <div className="text-center mt-4">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition">
                Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMockInterview;
