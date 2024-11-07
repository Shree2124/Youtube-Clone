import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: ${({ theme }) => theme.bg};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
`;

const Ul = styled.ul`
  display: flex;
  list-style: none;
  gap: 20px;
  padding: 0;
  margin: 0;
`;

const Li = styled.li`
  color: ${({ theme }) => theme.text};
  font-size: 1.2em;

  a {
    text-decoration: none;
    color: inherit;
    padding: 10px 15px;
    border-radius: 5px;
    transition: background-color 0.3s ease, color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.textSoft};
      color: ${({ theme }) => theme.text};
    }
  }
`;

const tabs = [
  {
    name: "Home",
    path: "/profile/home",
  },
  {
    name: "My Videos",
    path: "/profile/my-videos",
  },
  {
    name: "Subscribed Channels",
    path: "/profile/subs"
  }
];

const ProfileNavbar = () => {
  return (
    <Main>
      <Nav>
        <Ul>
          {tabs.map((i) => (
            <Li key={crypto.randomUUID()}>
              <Link to={i.path}>{i.name}</Link>
            </Li>
          ))}
        </Ul>
      </Nav>
    </Main>
  );
};

export default ProfileNavbar;
