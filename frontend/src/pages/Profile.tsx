import { useState, useEffect } from "react";
import api from "../utils/api";
import {
  Box,
  Heading,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Button,
  Container 
} from "@chakra-ui/react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Row, Col } from "react-bootstrap";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [updatedUser, setUpdatedUser] = useState<User | null>(null);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/core/me/");
        const users = await response.json();
        if (users.length > 0) {
          setUser(users[0]);
        }
      } catch (error) {
        setIsError(true);
        setErrorMessage((error as Error).message);
      }
    };

    fetchUser();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      const response = await api.remove(`/core/me/${user?.id}/`);
      if (response.ok) {
        localStorage.removeItem("user");
        setUser(null);
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage((error as Error).message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({ ...prevUser, [name]: value } as User));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedUser) return;

    try {
      const response = await api.patch(`/core/me/${user?.id}/`, updatedUser);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      setIsError(true);
      setErrorMessage((error as Error).message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxW="xl" mt={10}>
      <Row>
        <Col>
          <Box p={6} boxShadow="xl" borderRadius="lg">
            <Heading mb={6} fontSize="4xl" fontWeight="bold" textAlign="center">
              Profile
            </Heading>
            {isError && (
              <Alert status="error" mb={6}>
                <AlertIcon />
                {errorMessage}
              </Alert>
            )}
            <FormControl mb={4}>
              <FormLabel fontSize="xl">Username:</FormLabel>
              <Input
                type="text"
                name="username"
                onChange={handleInputChange}
                value={updatedUser?.username ?? user.username}
                borderRadius="full"
                borderColor="gray.300"
                borderWidth="2px"
                py={4}
                px={6}
                _focus={{
                  outline: "none",
                  boxShadow: "outline",
                  borderColor: "blue.500",
                }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="xl">Email:</FormLabel>
              <Input
                type="email"
                name="email"
                onChange={handleInputChange}
                value={updatedUser?.email ?? user.email}
                borderRadius="full"
                borderColor="gray.300"
                borderWidth="2px"
                py={4}
                px={6}
                _focus={{
                  outline: "none",
                  boxShadow: "outline",
                  borderColor: "blue.500",
                }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="xl">First Name:</FormLabel>
              <Input
                type="text"
                name="first_name"
                onChange={handleInputChange}
                value={updatedUser?.first_name ?? user.first_name}
                borderRadius="full"
                borderColor="gray.300"
                borderWidth="2px"
                py={4}
                px={6}
                _focus={{
                  outline: "none",
                  boxShadow: "outline",
                  borderColor: "blue.500",
                }}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="xl">Last Name:</FormLabel>
              <Input
                type="text"
                name="last_name"
                onChange={handleInputChange}
                value={updatedUser?.last_name ?? user.last_name}
                borderRadius="full"
                borderColor="gray.300"
                borderWidth="2px"
                py={4}
                px={6}
                _focus={{
                  outline: "none",
                  boxShadow: "outline",
                  borderColor: "blue.500",
                }}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              size="lg"
              mr={4}
              onClick={handleSubmit}
              disabled={!updatedUser}
              borderRadius="full"
              _hover={{ bg: "blue.500" }}
            >
              Update
            </Button>
            <Button
              colorScheme="red"
              size="lg"
              onClick={handleDeleteAccount}
              borderRadius="full"
              _hover={{ bg: "red.500" }}
            >
              Delete Account
            </Button>
          </Box>
        </Col>
      </Row>
    </Container>
  );
}
export default Profile;