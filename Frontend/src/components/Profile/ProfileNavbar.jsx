import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Main = styled.div``;

const Nav = styled.nav``;

const Ul = styled.ul``;

const Li = styled.li`
  color: ${({ theme }) => theme.text};
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
];

const ProfileNavbar = () => {
  return (
    <Main>
      <nav>
        <ul>
          {tabs.map((i) => (
            <Li key={crypto.randomUUID()}>
              <Link to={i.path}>{i.name}</Link>
            </Li>
          ))}
        </ul>
      </nav>
    </Main>
  );
};

export default ProfileNavbar;
