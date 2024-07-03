import { useState } from "react";
import {} from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MenuLayout, Signin } from "./components/index.js";
import styled, { ThemeProvider } from "styled-components";
import Navbar from "./components/Navbar/Navbar.jsx";
import { darkTheme, lightTheme } from "./utils/Theme.js";
import { Home, Videos } from "./pages/index.js";
import MobileContextProvider from "./components/context/ContextProvider.jsx";

const Container = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.bg};
  width: 100% !important;
  @media (max-width: 375px) {
    width: 100vw;
  }
`;

const Main = styled.div`
  flex: 7;
`;

const Wrapper = styled.div`
  padding: 1.5rem;
  width: 100%;
  @media (max-width: 375px) {
    padding-right: 0.5rem;
    margin: 0;
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);

  return (
    <>
      <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
        <MobileContextProvider>
          <BrowserRouter>
            <Container>
              <div>
                <MenuLayout setDarkMode={setDarkMode} darkMode={darkMode} />
              </div>
              <Main>
                <Navbar darkMode={darkMode} />
                <Wrapper>
                  <Routes>
                    <Route path="/" index element={<Home type="random" />} />
                    <Route path="/trends" element={<Home type="trend" />} />
                    <Route
                      path="/subscriptions"
                      element={<Home type="sub" />}
                    />
                    <Route path="/signin" element={<Signin />} />
                    <Route path="/video/:id" element={<Videos />} />
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
