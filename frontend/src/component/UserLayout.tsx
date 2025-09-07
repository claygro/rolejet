// src/layouts/UserLayout.tsx
import { Outlet } from "react-router-dom";
import NavBar from "../component/Navbar";
import Footer from "./Footer";

const UserLayout = () => {
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
