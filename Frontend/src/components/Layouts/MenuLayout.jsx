import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Drawer } from "@mui/material";
import MobileContext from "../context/MobileContext.js";
import ImgLogo from "../../Logo/logo-color.png";

// Import icons
import HomeIcon from "@mui/icons-material/Home";
import ExploreOutlinedIcon from "@mui/icons-material/ExploreOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import LibraryMusicOutlinedIcon from "@mui/icons-material/LibraryMusicOutlined";
import SportsBasketballOutlinedIcon from "@mui/icons-material/SportsBasketballOutlined";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import MovieOutlinedIcon from "@mui/icons-material/MovieOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import LiveTvOutlinedIcon from "@mui/icons-material/LiveTvOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import SettingsBrightnessOutlinedIcon from "@mui/icons-material/SettingsBrightnessOutlined";
import CloseIcon from "@mui/icons-material/Close";

const Menu = ({ darkMode, setDarkMode }) => {
  const auth = useSelector((state) => state.user.auth);
  const { isMobile, setIsMobile } = useContext(MobileContext);

  const MenuItem = ({ icon, text, link }) => {
    const Icon = icon;
    
    const content = (
      <div className={`flex items-center gap-5 p-2 rounded-lg cursor-pointer ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}>
        <Icon fontSize="small" />
        <span className="text-sm">{text}</span>
      </div>
    );

    return link ? (
      <Link to={link} className="text-inherit no-underline">
        {content}
      </Link>
    ) : content;
  };

  return (
    <div className={`h-full overflow-y-auto scrollbar-hide ${darkMode ? 'bg-zinc-900 text-white' : 'bg-white text-black'}`}>
      <div className="p-4">
        {isMobile && (
          <div className="flex justify-between items-center mb-6">
            <Link to="/" className="flex items-center gap-3 text-inherit no-underline">
              <img src={ImgLogo} alt="TuneTube Logo" className="h-6" />
              <span className="font-bold">TuneTube</span>
            </Link>
            
            <button 
              className={`p-1 rounded-full ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}
              onClick={() => setIsMobile(false)}
            >
              <CloseIcon />
            </button>
          </div>
        )}
        
        <MenuItem icon={HomeIcon} text="Home" link="/" />
        <MenuItem icon={ExploreOutlinedIcon} text="Explore" link="/trends" />
        <MenuItem icon={SubscriptionsOutlinedIcon} text="Subscriptions" link="/subscriptions" />
        
        <div className={`my-3 border-t ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}></div>
        
        <MenuItem icon={VideoLibraryOutlinedIcon} text="Library" />
        <MenuItem icon={HistoryOutlinedIcon} text="History" />
        
        <div className={`my-3 border-t ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}></div>
        
        {!auth && (
          <>
            <div className="mb-4">
              <p className="mb-2 text-sm">Sign in to like videos, comment, and subscribe.</p>
              <Link to="/signin" className="no-underline">
                <button className="flex items-center gap-2 hover:bg-blue-500 hover:bg-opacity-10 px-3 py-1 border border-blue-500 rounded text-blue-500">
                  <AccountCircleOutlinedIcon fontSize="small" />
                  <span>SIGN IN</span>
                </button>
              </Link>
            </div>
            <div className={`my-3 border-t ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}></div>
          </>
        )}
        
        <h3 className={`text-xs font-medium uppercase mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          Best of TuneTube
        </h3>
        
        <MenuItem icon={LibraryMusicOutlinedIcon} text="Music" />
        <MenuItem icon={SportsBasketballOutlinedIcon} text="Sports" />
        <MenuItem icon={SportsEsportsOutlinedIcon} text="Gaming" />
        <MenuItem icon={MovieOutlinedIcon} text="Movies" />
        <MenuItem icon={ArticleOutlinedIcon} text="News" />
        <MenuItem icon={LiveTvOutlinedIcon} text="Live" />
        
        <div className={`my-3 border-t ${darkMode ? 'border-zinc-800' : 'border-gray-200'}`}></div>
        
        <MenuItem icon={SettingsOutlinedIcon} text="Settings" />
        <MenuItem icon={FlagOutlinedIcon} text="Report" />
        <MenuItem icon={HelpOutlineOutlinedIcon} text="Help" />
        
        <div 
          className={`flex items-center gap-5 p-2 cursor-pointer ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-100'}`}
          onClick={() => setDarkMode(!darkMode)}
        >
          <SettingsBrightnessOutlinedIcon fontSize="small" />
          <span className="text-sm">{darkMode ? "Light" : "Dark"} Mode</span>
        </div>
      </div>
    </div>
  );
};

const MenuLayout = ({ darkMode, setDarkMode }) => {
  const { isMobile, handleClose } = useContext(MobileContext);

  return (
    <>
      <div className="hidden lg:block top-14 bottom-0 left-0 z-10 fixed w-64">
        <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
      
      <Drawer 
        open={isMobile} 
        onClose={handleClose}
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            border: 'none',
          },
        }}
      >
        <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
      </Drawer>
    </>
  );
};

export default MenuLayout;