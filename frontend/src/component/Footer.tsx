// src/components/Footer.jsx
import {
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-700 pb-6">
          {/* Logo */}
          <h1 className="text-2xl font-bold">
            <span className="text-white">Role</span>
            <span className="text-blue-500">Jet</span>
            <span className="text-gray-400">.</span>
          </h1>

          {/* Navigation */}
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
            <a href="/contact" className="hover:text-white">
              Contact Us
            </a>
            <a href="/about" className="hover:text-white">
              About Us
            </a>
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center md:justify-start space-x-4 mt-6">
          <a
            href="#"
            className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"
          >
            <FaInstagram className="text-white text-xl" />
          </a>
          <a
            href="#"
            className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"
          >
            <FaFacebook className="text-white text-xl" />
          </a>
          <a
            href="#"
            className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"
          >
            <FaLinkedin className="text-white text-xl" />
          </a>
          <a
            href="#"
            className="p-2 bg-gray-800 rounded-full hover:bg-blue-600"
          >
            <FaXTwitter className="text-white text-xl" />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="text-center md:text-left mt-6 text-sm text-gray-400">
          © <span className="font-semibold">Role Jet</span> 2025, All rights
          reserved!
        </div>
      </div>
    </footer>
  );
}
