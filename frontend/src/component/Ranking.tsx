import image1 from "../assets/image1.jpg";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/image3.jpg";
import image4 from "../assets/image4.jpg";
import image5 from "../assets/image5.jpg";

const applicants = [
  { id: 1, name: "John Doe", image: image1, rank: 1, points: 300 },
  { id: 2, name: "Jane Smith", image: image2, rank: 2, points: 280 },
  { id: 3, name: "Michael Lee", image: image3, rank: 3, points: 250 },
  { id: 4, name: "Sara Khan", image: image4, rank: 4, points: 220 },
  { id: 5, name: "David Chen", image: image5, rank: 5, points: 200 },
];

const Ranking = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Top Applicants Ranking
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Header row for desktop */}
        <div className="hidden md:grid grid-cols-6 gap-4 bg-gray-100 p-4 font-semibold text-gray-700">
          <span>Profile</span>
          <span>Username</span>
          <span>Rank</span>
          <span>Points</span>
          <span colSpan={2}></span>
        </div>

        {/* Applicants list */}
        {applicants.map((applicant) => (
          <div
            key={applicant.id}
            className="grid grid-cols-1 md:grid-cols-6 items-center gap-4 p-4 border-b border-gray-200"
          >
            {/* Profile Image */}
            <div className="flex items-center justify-start">
              <img
                src={applicant.image}
                alt={applicant.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>

            {/* Name */}
            <div className="flex items-center">
              <span className="text-gray-800 font-medium">
                {applicant.name}
              </span>
            </div>

            {/* Rank */}
            <div className="flex items-center">
              <span className="text-gray-600">#{applicant.rank}</span>
            </div>

            {/* Points */}
            <div className="flex items-center">
              <span className="text-gray-600">{applicant.points}</span>
            </div>

            {/* Select Button */}
            <div className="flex items-center">
              <button className="bg-green-600 text-white px-4 py-1 rounded-md hover:bg-green-700 transition w-full">
                Select
              </button>
            </div>

            {/* Reject Button */}
            <div className="flex items-center">
              <button className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 transition w-full">
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
