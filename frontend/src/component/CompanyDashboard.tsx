import { useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  FaBriefcase,
  FaUserCircle,
  FaCog,
  FaChartBar,
  FaBars,
} from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import Connection from "@/config/Connection.config";
import roleJetLogo from "../assets/roleJetLogo.png";
interface Token {
  name: string;
  email: string;
}

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [companyName, setCompanyName] = useState<Token | null>(null);

  const companyToken = async () => {
    try {
      const data = await Connection.get("/job/companyToken");
      const decodeData = jwtDecode<Token>(data.data);
      setCompanyName(decodeData);
    } catch (err) {
      console.log(` error in companyToken ${err}`);
      navigate("/loginCompany");
    }
  };

  useEffect(() => {
    companyToken();
  }, []);

  const handleLogout = async () => {
    try {
      await Connection.get("/job/logout");
      localStorage.removeItem("companyRegister");
      navigate("/loginCompany");
      window.location.reload();
    } catch (err) {
      console.log(`error in logout ${err}`);
    }
  };

  // Reusable function for NavLink styles
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 p-3 rounded-md transition-colors duration-200 ${
      isActive ? "bg-blue-700 text-white" : "hover:bg-blue-800 hover:text-white"
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-gradient-to-b from-blue-900 to-blue-700 text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-start">
          <img src={roleJetLogo} alt="Role jet " className="w-40 " />
        </div>
        <ul className="space-y-2 px-4">
          <li>
            <NavLink to="jobpost" className={navLinkClass}>
              <FaBriefcase /> Job Posts
            </NavLink>
          </li>
          <li>
            <NavLink to="profile" className={navLinkClass}>
              <FaUserCircle /> Profile
            </NavLink>
          </li>
          <li>
            <NavLink to="analytics" className={navLinkClass}>
              <FaChartBar /> Applications
            </NavLink>
          </li>
          <li>
            <NavLink to="settings" className={navLinkClass}>
              <FaCog /> Settings
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white shadow-md p-4">
          <button
            className="lg:hidden text-2xl text-blue-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <h2 className="text-lg font-bold text-gray-700">
            {companyName?.name ? (
              companyName.name
            ) : (
              <div className="w-5 h-5 m-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            )}
          </h2>
          <button
            onClick={handleLogout}
            className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800"
          >
            Logout
          </button>
        </div>

        {/* Scrollable main content */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
