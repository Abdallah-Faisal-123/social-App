
import { faBell, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faSquareShareNodes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, NavLink } from "react-router";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="shadow bg-white sticky top-0 z-50">
        <div className="container mx-auto py-3 px-4 flex items-center justify-between">

          <h1 className="flex-shrink-0">
            <Link to="/" className="text-xl md:text-2xl lg:text-3xl font-bold flex items-center gap-1 md:gap-2">
              <FontAwesomeIcon icon={faSquareShareNodes} className="text-blue-600 text-2xl md:text-3xl lg:text-4xl" />
              <span className="hidden sm:inline">SocialHup</span>
              <span className="sm:hidden">SocialHup</span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex ms-auto px-3">
            <li className="mx-2"><NavLink to="/" className={({ isActive }) => `${isActive && "text-blue-600"} font-semibold hover:text-blue-600 transition`}>Home</NavLink></li>
            <li className="mx-2"><NavLink to="/profile" className={({ isActive }) => `${isActive && "text-blue-600"} font-semibold hover:text-blue-600 transition`}>Profile</NavLink></li>
            <li className="mx-2"><NavLink to="/settings" className={({ isActive }) => `${isActive && "text-blue-600"} font-semibold hover:text-blue-600 transition`}>Settings</NavLink></li>
          </ul>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <span className="text-lg text-gray-600 relative cursor-pointer hover:text-blue-600 transition">
              <FontAwesomeIcon icon={faBell} className="p-1" />
              <span className="w-2 h-2 bg-red-600 rounded-full absolute top-0 right-0"></span>
            </span>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-2xl text-gray-700 hover:text-blue-600 transition p-2"
              aria-label="Toggle menu"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
          <ul className="flex flex-col bg-gray-50 border-t border-gray-200">
            <li className="border-b border-gray-200">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive && "text-blue-600 bg-blue-50"} font-semibold hover:bg-gray-100 transition block px-6 py-4`}
              >
                Home
              </NavLink>
            </li>
            <li className="border-b border-gray-200">
              <NavLink
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive && "text-blue-600 bg-blue-50"} font-semibold hover:bg-gray-100 transition block px-6 py-4`}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `${isActive && "text-blue-600 bg-blue-50"} font-semibold hover:bg-gray-100 transition block px-6 py-4`}
              >
                Settings
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
