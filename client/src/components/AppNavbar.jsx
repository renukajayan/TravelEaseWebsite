import { Button, Container, Group, Title } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container size="lg" py="md">
      <Group justify="space-between">
        <Title order={2}>TravelEase</Title>

        <Group>
          <Button component={Link} to="/" variant="subtle">
            Home
          </Button>
          <Button component={Link} to="/destinations" variant="subtle">
            Destinations
          </Button>
          <Button component={Link} to="/packages" variant="subtle">
            Packages
          </Button>

          {user ? (
            <>
              <Button component={Link} to="/my-bookings" variant="subtle">
                My Bookings
              </Button>

              {user.role === "admin" && (
                <Button component={Link} to="/admin" variant="subtle">
                  Admin
                </Button>
              )}

              <Button color="red" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="outline">
                Login
              </Button>
              <Button component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Group>
      </Group>
    </Container>
  );
}

export default AppNavbar;