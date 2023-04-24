import {
  Container,
  Flex,
  Spacer,
  Link,
  Heading,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const [isSmallerThanLg] = useMediaQuery("(max-width: 991px)");

  return (
    <Flex as="header" bg="blue.600" w="100%" justifyContent="center">
      <Container maxW="container.xl">
        <Flex justify="space-between" alignItems="center" py="2">
          <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
            <Heading size="lg" color="white">
              A-Partner
            </Heading>
          </Link>
          <Spacer />
          {isSmallerThanLg ? (
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                colorScheme="blue"
              >
                Menu
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/core">Core</MenuItem>
                <MenuItem as={RouterLink} to="/me">Me</MenuItem>
                <MenuItem as={RouterLink} to="/owner">Owner</MenuItem>
                <MenuItem as={RouterLink} to="/searcher">Searcher</MenuItem>
                <MenuItem as={RouterLink} to="/renter">Renter</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Flex alignItems="center">
              <NavLinks />
              <Button colorScheme="blue" ml="4" as={RouterLink} to="/login">
                Login
              </Button>
            </Flex>
          )}
        </Flex>
      </Container>
    </Flex>
  );
};

const NavLinks = () => (
  <Flex as="nav" alignItems="center" justifyContent="space-between" w="100%">
    <NavLink to="/core">Core</NavLink>
    <NavLink to="/me">Me</NavLink>

    <Menu>
      <MenuButton as={Button} color="white" fontWeight="medium" mr="4" _hover={{ textDecoration: "none" }}>
        <Flex alignItems="center">
          <RouterLink to="/owner" style={{ textDecoration: "none", color: "white" }}>
            Owner
          </RouterLink>
          <ChevronRightIcon ml="1" />
        </Flex>
      </MenuButton>
      <MenuList>
        <MenuItem as={RouterLink} to="/owner/my-apartments">
          My Apartments
        </MenuItem>
        <MenuItem as={RouterLink} to="/owner/my-rooms">
          My Rooms
        </MenuItem>
        <MenuItem as={RouterLink} to="/owner/contracts">
          My Contracts
        </MenuItem>
      </MenuList>
    </Menu>
    <Menu>
      <MenuButton as={Button} color="white" fontWeight="medium" mr="4" _hover={{ textDecoration: "none" }}>
        <Flex alignItems="center">
          <RouterLink to="/Searcher" style={{ textDecoration: "none", color: "white" }}>
            Searcher
          </RouterLink>
          <ChevronRightIcon ml="1" />
        </Flex>
      </MenuButton>
      <MenuList>
      <MenuItem as={RouterLink} to="/searcher/search">
          Search
        </MenuItem>
      </MenuList>
    </Menu>
    <Menu>
      <MenuButton as={Button} color="white" fontWeight="medium" mr="4" _hover={{ textDecoration: "none" }}>
        <Flex alignItems="center">
          <RouterLink to="/Renter" style={{ textDecoration: "none", color: "white" }}>
            Renter
          </RouterLink>
          <ChevronRightIcon ml="1" />
        </Flex>
      </MenuButton>
      <MenuList>
      <MenuItem as={RouterLink} to="/renter/my-apartment">
          My Apartment
        </MenuItem>
        <MenuItem as={RouterLink} to="/renter/my-bills">
          My Bills
        </MenuItem>
        <MenuItem as={RouterLink} to="/renter/my-room">
          My Room
        </MenuItem>
      </MenuList>
    </Menu>
  </Flex>
);

const NavLink = ({
  to,
  children,
}: {
  to: string;
  children: React.ReactNode;
}) => (
  <Link
    as={RouterLink}
    to={to}
    color="white"
    fontWeight="medium"
    _hover={{ textDecoration: "none" }}
  >
    {children}
  </Link>
);

export default Header;
