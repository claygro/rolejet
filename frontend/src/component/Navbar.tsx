// NavBar.tsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Connection from "@/config/Connection.config";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi"; // icons

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // hide on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup")
    return null;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await Connection.delete("/job/logout"); // adjust endpoint if different
      localStorage.setItem("userRegistration", JSON.stringify(false));
      navigate("/userLogin");
      window.location.reload();
    } catch (err) {
      console.error("Logout error", err);
      setLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky  w-full top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <NavLink to="/user" className="text-2xl font-bold text-blue-700">
              Rolejet<span className="text-gray-500">.</span>
            </NavLink>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-6">
            <NavLink
              to="/user"
              end
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              Jobs
            </NavLink>
            <NavLink
              to="/user/profilePage"
              end
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              My profile
            </NavLink>
            <NavLink
              to="/user/about"
              end
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              About us
            </NavLink>
            <NavLink
              to="/user/preparation"
              end
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              Preparation
            </NavLink>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-gray-700 hover:text-blue-700"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t  fixed top-20 left-0 w-full  z-auto border-gray-200 shadow-md">
          <div className="flex flex-col px-4 py-3 space-y-3">
            <NavLink
              to="/user"
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 hover:text-blue-700 transition"
            >
              Jobs
            </NavLink>
            <NavLink
              to="/user/profilePage"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              My profile
            </NavLink>
            <NavLink
              to="/user/about"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-blue-700 font-semibold" : "text-gray-700"
                } hover:text-blue-700`
              }
            >
              About us
            </NavLink>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition w-fit"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
