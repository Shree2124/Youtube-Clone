import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuLayout, Signin } from "./components/index.js";
import styled, { ThemeProvider } from "styled-components";
import Navbar from "./components/Navbar/Navbar.jsx";
import { darkTheme, lightTheme } from "./utils/Theme.js";
import { Home, Videos, UploadVideo } from "./pages/index.js";
import MobileContextProvider from "./components/context/ContextProvider.jsx";
import useAuth from "./hooks/useAuth.js";
import ProfileHome from "./components/Profile/Home.jsx";
import MyVideos from "./components/Profile/MyVideos.jsx";
import Subs from "./components/Profile/Subs.jsx";

const Container = styled.div`
  justify-content: space-between;
  flex-direction: row;
  background-color: ${({ theme }) => theme.bg};
  width: 100% !important;
  @media (max-width: 375px) {
    width: 100vw;
  }
`;

const Main = styled.div`
  /* @media (max-width: 1024px) {
    flex: 2
  } */
`;

const Wrapper = styled.div`
  margin-top: 4rem;
  padding: 1.5rem;
  width: 100%;
  flex: 2;
  @media (max-width: 375px) {
    padding-right: 0.5rem;
    margin: 0;
  }
`;

function App() {
  useAuth();

  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <MobileContextProvider>
          <BrowserRouter>
            <Navbar darkMode={darkMode} />
            <MenuLayout setDarkMode={setDarkMode} darkMode={darkMode} />
            <Container>
              <Main>
                <Wrapper>
                  <Routes>
                    <Route path="/" index element={<Home type="random" />} />
                    <Route path="/trends" element={<Home type="trend" />} />
                    <Route
                      path="/subscriptions"
                      element={<Home type="sub" />}
                    />
                    <Route path="/signin" element={<Signin />} />
                    <Route
                      path="/upload-video"
                      element={<UploadVideo darkMode={darkMode} />}
                    />
                    <Route path="/video/:id" element={<Videos />} />
                    <Route
                      path="/profile/home"
                      element={<ProfileHome darkMode={darkMode} />}
                    ></Route>
                    <Route
                      path="/profile/subs"
                      element={<Subs darkMode={darkMode} />}
                    ></Route>
                    <Route
                      path="/profile/my-videos"
                      element={<MyVideos darkMode={darkMode} />}
                    ></Route>
                  </Routes>
                </Wrapper>
              </Main>
            </Container>
          </BrowserRouter>
        </MobileContextProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
