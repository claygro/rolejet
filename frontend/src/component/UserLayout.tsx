// src/layouts/UserLayout.tsx
import { Outlet, useNavigate } from "react-router-dom";
import NavBar from "../component/Navbar";
import Footer from "./Footer";
import { useEffect } from "react";
import Connection from "@/config/Connection.config";
const UserLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    async function getToken() {
      try {
        const token = await Connection.get("/job/getCookie");
        const cookie = token.data.token;
        if (!cookie) {
          navigate("/userLogin");
        }
      } catch (err) {
        console.log(`Error in get token ${err}`);
        navigate("/userLogin");
      }
    }
    getToken();
  }, [navigate]);
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always visible for user dashboard */}
      <NavBar />
      {/* Main page content */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
