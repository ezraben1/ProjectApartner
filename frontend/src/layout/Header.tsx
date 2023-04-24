import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          A-Partner
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/core">
              Core
            </Nav.Link>
            <Nav.Link as={Link} to="/me">
              Me
            </Nav.Link>
            <Nav.Link as={Link} to="/owner">
              Owner
            </Nav.Link>
            <Nav.Link as={Link} to="/searcher">
              Searcher
            </Nav.Link>
            <Nav.Link as={Link} to="/renter">
              Renter
            </Nav.Link>
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
