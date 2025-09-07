const Aboutus = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          About Role Jet
        </h1>
        <p className="text-gray-600 leading-relaxed mb-6 text-center">
          Role Jet is a modern job platform designed to connect job seekers with
          the right opportunities. We aim to make the hiring process simple,
          transparent, and effective by leveraging technology to match talent
          with the right companies. Our mission is to empower individuals to
          achieve their career goals while helping businesses find the best-fit
          candidates.
        </p>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-3 text-center">
            Contact Us
          </h2>
          <div className="space-y-2 text-gray-600 text-center">
            <p>
              <span className="font-medium">Email:</span> rolejet6@gmail.com
            </p>
            <p>
              <span className="font-medium">Phone:</span> 9865206199
            </p>
            <p>
              <span className="font-medium">Address:</span> Chitwan, Nepal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutus;
