interface Plan {
  name: string;
  price: string;
  features: string[];
}

const plans: Plan[] = [
  {
    name: "Basic",
    price: "Free",
    features: [
      "Apply to 5 jobs per month",
      "Limited AI interview attempts",
      "View ranking in company dashboard",
    ],
  },
  {
    name: "Plus",
    price: "$9.99 / mo",
    features: [
      "Unlimited job applications",
      "Unlimited AI interviews",
      "Priority ranking visibility",
    ],
  },
  {
    name: "Professional",
    price: "$19.99 / mo",
    features: [
      "All Plus features included",
      "Highlighted profile & ranking boost",
      "Advanced AI interview insights",
    ],
  },
];

const Pricing = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 md:px-12">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">
        Choose Your Plan
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col items-center text-center rounded-3xl p-6 transition-transform transform hover:scale-105 ${
              plan.name === "Professional"
                ? "bg-blue-50 border-2 border-blue-500"
                : "bg-white shadow-md"
            }`}
          >
            {plan.name === "Professional" && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold mb-3">
                Most Popular
              </span>
            )}
            <h2 className="text-xl font-semibold text-gray-700">{plan.name}</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {plan.price}
            </p>

            <ul className="text-gray-600 text-sm space-y-2 mt-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-green-500">✔️</span> {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-white transition-colors ${
                plan.name === "Professional"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-800 hover:bg-gray-900"
              }`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
