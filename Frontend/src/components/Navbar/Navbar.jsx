import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Box, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MobileContext from "../context/MobileContext.js";
import axiosInstance from "../../api/axios.js";
import ImgLogo from "../../Logo/logo-color.png";
import { clearUser, setAuth } from "../../redux/slices/userSlice";

const Navbar = ({ darkMode }) => {
  const { auth, user } = useSelector((state) => state?.user);
  const { isMobile, setIsMobile } = useContext(MobileContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleToggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const handleOptionClick = async (option) => {
    if (option === "Upload Video") {
      navigate("/upload-video");
    } else if (option === "Logout") {
      try {
        const res = await axiosInstance.post("/users/logout");
        if (res.status === 200) {
          // Update Redux store instead of reloading
          dispatch(clearUser());
          dispatch(setAuth(false));
          navigate("/");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    } else if (option === "Profile") {
      navigate("/profile/home");
    }
    setDropdownOpen(false);
  };

  const handleMobileToggle = () => {
    setIsMobile((prev) => !prev);
  };

  return (
    <div className={`fixed top-0 w-full z-20 py-2 px-4 md:px-8 shadow-md ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle button - only visible on mobile */}
          <button 
            className="lg:hidden md:visible hover:bg-gray-200 hover:bg-opacity-20 p-2 rounded-full"
            onClick={handleMobileToggle}
          >
            {!isMobile ? <MenuIcon /> : <CloseIcon />}
          </button>
          
          {/* Logo - shown on all screen sizes */}
          <Link to="/" className="flex items-center gap-2">
            <img src={ImgLogo} alt="TuneTube Logo" className="h-8" />
            <span className="font-bold">TuneTube</span>
          </Link>
        </div>

        {/* Search form - takes up available space but has max width */}
        <form 
          className="flex-grow mx-2 md:mx-4 max-w-md lg:max-w-xl"
          onSubmit={handleSearch}
        >
          <div className={`flex items-center border rounded-full overflow-hidden ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <input
              type="text" 
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-1 md:py-2 px-2 md:px-4 outline-none text-sm md:text-base ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}
            />
            <button 
              type="submit"
              className={`p-1 md:p-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <SearchOutlinedIcon fontSize="small" />
            </button>
          </div>
        </form>

        {/* Sign in button or user profile */}
        {!auth ? (
          <Link to="/signin" className="flex items-center ml-2">
            <button className="flex items-center gap-1 md:gap-2 hover:bg-blue-500 hover:bg-opacity-10 px-2 md:px-3 py-1 border border-blue-500 rounded text-blue-500 text-xs md:text-sm">
              <AccountCircleOutlinedIcon fontSize="small" />
              <span>SIGN IN</span>
            </button>
          </Link>
        ) : (
          <div className="relative ml-2">
            <div className="flex items-center cursor-pointer" onClick={handleToggleDropdown}>
              <Avatar 
                src={user?.avatar || "https://www.w3schools.com/howto/img_avatar.png"}
                sx={{ width: { xs: 28, md: 32 }, height: { xs: 28, md: 32 } }}
              />
              <span className="hidden sm:block mr-1 ml-2 text-xl">{user?.name || "User"}</span>
              <ArrowDropDownIcon />
            </div>

            {isDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-40 md:w-48 rounded-md shadow-lg py-1 ${darkMode ? 'bg-zinc-800' : 'bg-white'}`}>
                <div 
                  className={`px-4 py-2 text-sm hover:bg-opacity-10 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} cursor-pointer`}
                  onClick={() => handleOptionClick("Profile")}
                >
                  Profile
                </div>
                <div 
                  className={`px-4 py-2 text-sm hover:bg-opacity-10 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} cursor-pointer`}
                  onClick={() => handleOptionClick("Upload Video")}
                >
                  Upload Video
                </div>
                <div 
                  className={`px-4 py-2 text-sm hover:bg-opacity-10 ${darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'} cursor-pointer`}
                  onClick={() => handleOptionClick("Logout")}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;