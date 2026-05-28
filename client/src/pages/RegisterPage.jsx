import { useState } from "react";
import {
  Alert,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Link, useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { registerUser } from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  // HANDLE SUBMIT WITH VALIDATION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation checks
    if (!formData.name.trim()) {
      setError("Name is required");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await registerUser(formData);

      notifications.show({
        title: "Success",
        message: "Registered successfully. Please log in.",
      });

      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />
      <Container size="xs" py="xl">
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Title order={2} mb="lg">
            Register
          </Title>

          <form onSubmit={handleSubmit}>
            <Stack>
              {error && <Alert color="red">{error}</Alert>}

              <TextInput
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange("name")}
                required
              />

              <TextInput
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange("email")}
                required
              />

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange("password")}
                required
              />

              <Button type="submit" loading={loading}>
                Register
              </Button>

              <Button component={Link} to="/login" variant="subtle">
                Already have an account? Login
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default RegisterPage;