import Connection from "@/config/Connection.config";
import { useEffect, useState, useRef } from "react";
import { toast, Toaster } from "sonner";

interface UserProfile {
  username: string;
  email: string;
  location: string;
  preference: string;
  lookingFor: string;
  profilePic: string;
}

const UserProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [fieldValue, setFieldValue] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const response = await Connection.get("/job/userProfilePage");
      setUserProfile(response.data);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle edit click
  const handleEditClick = (field: keyof UserProfile) => {
    setEditingField(field);
    setFieldValue(userProfile ? userProfile[field] : "");
  };

  // Handle save
  const handleSave = async () => {
    if (!editingField) return;

    try {
      const updateData: Partial<UserProfile> = {};
      updateData[editingField] = fieldValue;

      await Connection.put("/job/userProfileEdit", updateData);
      toast.success(`${editingField} updated successfully`);

      fetchProfile();
      setEditingField(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update field");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setEditingField(null);
    setFieldValue("");
  };

  // Handle image click
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await Connection.put(
        "/job/userProfilePicEdit",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Profile picture updated!");
      fetchProfile();
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to update profile picture"
      );
    }
  };

  if (!userProfile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start p-6 md:p-16">
      <Toaster position="top-right" />
      <div className="bg-white p-10 shadow-xl flex flex-col md:flex-row w-full max-w-5xl rounded-lg overflow-hidden">
        {/* Left Side - Image */}
        <div className="md:w-1/3 h-96 md:h-auto relative cursor-pointer">
          <img
            src={`http://localhost:8000${userProfile.profilePic}`}
            alt={userProfile.username}
            className="w-full h-full object-cover"
            onClick={handleImageClick}
          />
          <div className="absolute bottom-2 left-2 bg-gray-700 bg-opacity-70 text-white px-2 py-1 rounded text-sm">
            Click to change
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Right Side - Info */}
        <div className="md:w-2/3 p-10 flex flex-col justify-center space-y-6">
          {/* Username */}
          <h1 className="text-gray-700 text-3xl md:text-4xl font-bold">
            {editingField === "username" ? (
              <div className="flex items-center space-x-3 mt-2">
                <input
                  type="text"
                  value={fieldValue}
                  onChange={(e) => setFieldValue(e.target.value)}
                  className="border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-xl w-full"
                />
                <button
                  onClick={handleSave}
                  className="px-5 py-2 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-shadow shadow-md"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 bg-gray-400 text-white text-lg font-semibold rounded-lg hover:bg-gray-500 transition-shadow shadow-md"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div
                onClick={() => handleEditClick("username")}
                className="cursor-pointer"
              >
                Username: {userProfile?.username}
              </div>
            )}
          </h1>

          {/* Other fields */}
          {["location", "email", "preference", "lookingFor"].map((field) => (
            <h2 key={field} className="text-gray-700 text-lg font-semibold">
              {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
              {editingField === field ? (
                <span className="flex items-center space-x-3 mt-1">
                  <input
                    type="text"
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    className="border border-gray-300 px-3 py-1 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-lg w-full"
                  />
                  <button
                    onClick={handleSave}
                    className="px-4 py-1 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-shadow shadow-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1 bg-gray-400 text-white text-lg font-semibold rounded-lg hover:bg-gray-500 transition-shadow shadow-md"
                  >
                    Cancel
                  </button>
                </span>
              ) : (
                <span
                  onClick={() => handleEditClick(field as keyof UserProfile)}
                  className="cursor-pointer text-gray-700"
                >
                  {userProfile[field as keyof UserProfile]}
                </span>
              )}
            </h2>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
