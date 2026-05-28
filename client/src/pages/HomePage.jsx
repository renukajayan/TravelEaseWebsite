import {
  Button,
  Container,
  Overlay,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

function HomePage() {
  return (
    <>
      <AppNavbar />

      <Container size="lg" py="xl">
        <Paper
          radius="lg"
          p={60}
          style={{
            position: "relative",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
        >
          {/* Dark overlay */}
          <Overlay opacity={0.45} zIndex={0} />

          {/* Content */}
          <Stack
            align="center"
            gap="lg"
            style={{ position: "relative", zIndex: 1 }}
          >
            <Title c="white" order={1} ta="center">
              Explore Your Next Adventure
            </Title>

            <Text c="white" size="lg" ta="center" maw={600}>
              Discover destinations, compare holiday packages, and book your next
              dream trip with TravelEase.
            </Text>

            {/* Buttons (combined both pages ideas) */}
            <Stack direction="row" gap="md">
              <Button component={Link} to="/destinations" size="md">
                Explore Destinations
              </Button>

              <Button
                component={Link}
                to="/packages"
                size="md"
                variant="white"
                c="dark"
              >
                Explore Packages
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </>
  );
}

export default HomePage;