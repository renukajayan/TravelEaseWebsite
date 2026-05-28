import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Alert,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Image,
  List,
  Loader,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import AppNavbar from "../components/AppNavbar";
import { getPackageById } from "../services/api";
import { useAuth } from "../context/AuthContext";

function PackageDetailsPage() {
  const { id } = useParams();
  const { token } = useAuth();

  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPackage() {
      setLoading(true);
      setError("");

      try {
        const data = await getPackageById(id);
        setPkg(data);
      } catch (err) {
        setError(err.message || "Failed to load package details");
      } finally {
        setLoading(false);
      }
    }

    fetchPackage();
  }, [id]);

  return (
    <>
      <AppNavbar />
      <Container size="md" py="xl">
        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : error ? (
          <Alert color="red">{error}</Alert>
        ) : !pkg ? (
          <Text>Package not found.</Text>
        ) : (
          <Stack gap="lg">
            <Image
              src={
                pkg.imageUrl ||
                "https://via.placeholder.com/800x320?text=Travel+Package"
              }
              h={320}
              radius="md"
              alt={pkg.title}
            />

            <Title>{pkg.title}</Title>

           <Group mt="md" mb="lg" gap="md">
            <Badge size="xl" radius="sm" color="blue" variant="filled">
              ${pkg.price}
            </Badge>

            <Badge size="xl" radius="sm" color="green" variant="filled">
              {pkg.durationDays} Days
            </Badge>

            <Badge size="xl" radius="sm" color="grape" variant="filled">
              Slots: {pkg.availableSlots}
            </Badge>
          </Group>

            <Text>{pkg.description}</Text>

            <Text fw={700}>Destination</Text>
            <Text>
              {pkg.destinationId?.name || "Unknown"}
              {pkg.destinationId?.country
                ? ` - ${pkg.destinationId.country}`
                : ""}
            </Text>

            <Text fw={700}>Places Included</Text>
            <List spacing="xs">
              {(pkg.placesIncluded || []).map((place, index) => (
                <List.Item key={index}>{place}</List.Item>
              ))}
            </List>

            <Text fw={700}>Features</Text>
            <List spacing="xs">
              {(pkg.features || []).map((feature, index) => (
                <List.Item key={index}>{feature}</List.Item>
              ))}
            </List>

            {token ? (
              <Button component={Link} to={`/booking/${pkg._id}`}>
                Book Now
              </Button>
            ) : (
              <Button component={Link} to="/login">
                Login to Book
              </Button>
            )}
          </Stack>
        )}
      </Container>
    </>
  );
}

export default PackageDetailsPage;