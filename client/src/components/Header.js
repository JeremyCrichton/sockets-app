import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 1rem;
`;

const Header = ({ username, numUsers }) => {
  return (
    <StyledHeader>
      <span>{username ? `Chatting as: ${username}` : `Join a room :)`}</span>
      <span>Users online: {numUsers}</span>
    </StyledHeader>
  );
};

export default Header;
