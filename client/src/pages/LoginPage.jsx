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
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
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
    if (!formData.email.trim()) {
      setError("Email is required");
      setLoading(false);
      return;
    }

    if (!formData.password.trim()) {
      setError("Password is required");
      setLoading(false);
      return;
    }

    try {
      const data = await loginUser(formData);
      login(data.user, data.token);

      notifications.show({
        title: "Success",
        message: "Logged in successfully",
      });

      navigate("/my-bookings");
    } catch (err) {
      setError(err.message || "Login failed");
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
            Login
          </Title>

          <form onSubmit={handleSubmit}>
            <Stack>
              {error && <Alert color="red">{error}</Alert>}

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
                Login
              </Button>

              <Button component={Link} to="/register" variant="subtle">
                Don&apos;t have an account? Register
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default LoginPage;