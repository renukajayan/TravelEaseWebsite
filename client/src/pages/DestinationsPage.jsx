import { useEffect, useState } from "react";
import { Center, Container, Grid, Loader, Text, Title } from "@mantine/core";
import AppNavbar from "../components/AppNavbar";
import DestinationCard from "../components/DestinationCard";
import { getDestinations } from "../services/api";

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDestinations() {
      try {
        const data = await getDestinations();
        setDestinations(data);
      } catch (error) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDestinations();
  }, []);

  return (
    <>
      <AppNavbar />
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Destinations
        </Title>

        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : destinations.length === 0 ? (
          <Text>No destinations found.</Text>
        ) : (
          <Grid>
            {destinations.map((destination) => (
              <Grid.Col key={destination._id} span={{ base: 12, sm: 6, md: 4 }}>
                <DestinationCard destination={destination} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default DestinationsPage;