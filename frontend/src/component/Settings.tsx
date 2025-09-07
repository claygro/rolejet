import Connection from "@/config/Connection.config";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { toast, Toaster } from "sonner";

const Settings = () => {
  const [companyDetails, setCompanyDetails] = useState<any>({});
  const [currentCompanyEmail, setCurrentCompanyEmail] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [updatedFieldValue, setUpdatedFieldValue] = useState<string>("");

  // Decode JWT from cookie
  useEffect(() => {
    async function decodeCookie() {
      try {
        const token = await Connection.get("/job/companyToken", { withCredentials: true });
        const decode: any = jwtDecode(token.data);
        setCurrentCompanyEmail(decode.email);
      } catch (err) {
        console.error("Error decoding cookie:", err);
      }
    }
    decodeCookie();
  }, []);

  // Fetch company details
  useEffect(() => {
    if (!currentCompanyEmail) return;

    async function fetchCompanyDetails() {
      try {
        const res = await Connection.post("/job/companyDetails", { email: currentCompanyEmail });
        setCompanyDetails(res.data);
      } catch (err) {
        console.error("Error fetching company details:", err);
        toast.error("Failed to fetch company details");
      }
    }

    fetchCompanyDetails();
  }, [currentCompanyEmail]);

  // Handle update
  const handleUpdate = async (field: string) => {
    try {
      const payload: any = { [field]: updatedFieldValue };
      await Connection.put("/job/companyUpdate", payload, { withCredentials: true });
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`);
      setEditingField(null);
      window.location.reload(); // refresh page for real-time update
    } catch (err: any) {
      console.error(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-50 shadow-lg rounded-xl mt-10 border border-gray-200">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Settings</h1>
      <p className="text-gray-600 mb-6">Manage your company account details below.</p>

      {/* Company Name */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Company Name</label>
        <button
          onClick={() => {
            if (editingField === "name") {
              setEditingField(null);
            } else {
              setEditingField("name");
              setUpdatedFieldValue(companyDetails.name || "");
            }
          }}
          className={`w-full text-left px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
            editingField === "name"
              ? "bg-gray-100 text-gray-800"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
        >
          {editingField === "name" ? "Editing..." : companyDetails.name || "Not set"}
        </button>
        {editingField === "name" && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={updatedFieldValue}
              onChange={(e) => setUpdatedFieldValue(e.target.value)}
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={() => handleUpdate("name")}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <button
          onClick={() => {
            if (editingField === "email") {
              setEditingField(null);
            } else {
              setEditingField("email");
              setUpdatedFieldValue(companyDetails.email || "");
            }
          }}
          className={`w-full text-left px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
            editingField === "email"
              ? "bg-gray-100 text-gray-800"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
        >
          {editingField === "email" ? "Editing..." : companyDetails.email || "Not set"}
        </button>
        {editingField === "email" && (
          <div className="mt-2 flex gap-2">
            <input
              type="email"
              value={updatedFieldValue}
              onChange={(e) => setUpdatedFieldValue(e.target.value)}
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={() => handleUpdate("email")}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Location */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Location</label>
        <button
          onClick={() => {
            if (editingField === "location") {
              setEditingField(null);
            } else {
              setEditingField("location");
              setUpdatedFieldValue(companyDetails.location || "");
            }
          }}
          className={`w-full text-left px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
            editingField === "location"
              ? "bg-gray-100 text-gray-800"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
        >
          {editingField === "location" ? "Editing..." : companyDetails.location || "Not set"}
        </button>
        {editingField === "location" && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={updatedFieldValue}
              onChange={(e) => setUpdatedFieldValue(e.target.value)}
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={() => handleUpdate("location")}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Industry */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Industry</label>
        <button
          onClick={() => {
            if (editingField === "industry") {
              setEditingField(null);
            } else {
              setEditingField("industry");
              setUpdatedFieldValue(companyDetails.industry || "");
            }
          }}
          className={`w-full text-left px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
            editingField === "industry"
              ? "bg-gray-100 text-gray-800"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
        >
          {editingField === "industry" ? "Editing..." : companyDetails.industry || "Not set"}
        </button>
        {editingField === "industry" && (
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={updatedFieldValue}
              onChange={(e) => setUpdatedFieldValue(e.target.value)}
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={() => handleUpdate("industry")}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Password */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-1">Password</label>
        <button
          onClick={() => {
            if (editingField === "password") {
              setEditingField(null);
            } else {
              setEditingField("password");
              setUpdatedFieldValue("");
            }
          }}
          className={`w-full text-left px-4 py-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors ${
            editingField === "password"
              ? "bg-gray-100 text-gray-800"
              : "bg-white text-gray-700 hover:bg-gray-200"
          }`}
        >
          {editingField === "password" ? "Editing..." : "********"}
        </button>
        {editingField === "password" && (
          <div className="mt-2 flex gap-2">
            <input
              type="password"
              value={updatedFieldValue}
              onChange={(e) => setUpdatedFieldValue(e.target.value)}
              className="flex-1 border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              onClick={() => handleUpdate("password")}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Save
            </button>
            <button
              onClick={() => setEditingField(null)}
              className="bg-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
