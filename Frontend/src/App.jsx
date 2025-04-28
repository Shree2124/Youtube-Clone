import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";
import { MenuLayout, Signin } from "./components/index.js";
import { Home, Videos, UploadVideo } from "./pages/index.js";
import MobileContextProvider from "./components/context/ContextProvider.jsx";
import useAuth from "./hooks/useAuth.js";
import ProfileHome from "./components/Profile/Home.jsx";
import MyVideos from "./components/Profile/MyVideos.jsx";
import Subs from "./components/Profile/Subs.jsx";
import Search from "./components/Search/Search.jsx";

function App() {
  useAuth();
  const [darkMode, setDarkMode] = useState(true);

  return (
    <div className={darkMode ? 'bg-zinc-950 text-white' : 'bg-gray-50 text-black'}>
      <MobileContextProvider>
        <BrowserRouter>
          <Navbar darkMode={darkMode} />
          <MenuLayout setDarkMode={setDarkMode} darkMode={darkMode} />
          
          <div className="flex">
            {/* This div takes up space equal to sidebar width on large screens */}
            <div className="hidden lg:block w-64"></div>
            
            {/* Main content area */}
            <main className="flex-1 min-h-screen">
              <div className="px-4 md:px-8 pt-16 w-full">
                <Routes>
                  <Route path="/" index element={<Home type="random" />} />
                  <Route path="/trends" element={<Home type="trend" />} />
                  <Route path="search" element={<Search />} />
                  <Route path="/subscriptions" element={<Home type="sub" />} />
                  <Route path="/signin" element={<Signin />} />
                  <Route path="/upload-video" element={<UploadVideo darkMode={darkMode} />} />
                  <Route path="/video/:id" element={<Videos />} />
                  <Route path="/profile/home" element={<ProfileHome darkMode={darkMode} />} />
                  <Route path="/profile/subs" element={<Subs darkMode={darkMode} />} />
                  <Route path="/profile/my-videos" element={<MyVideos darkMode={darkMode} />} />
                </Routes>
              </div>
            </main>
          </div>
        </BrowserRouter>
      </MobileContextProvider>
    </div>
  );
}

export default App;