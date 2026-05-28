import { Badge, Button, Card, Image, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";

function DestinationCard({ destination }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image src={destination.imageUrl} height={200} alt={destination.name} />
      </Card.Section>

      <Stack mt="md" gap="xs">
        <Text fw={700} size="lg">
          {destination.name}
        </Text>

        <Badge variant="light">{destination.country}</Badge>

        <Text size="sm" c="dimmed" lineClamp={3}>
          {destination.description}
        </Text>

        <Text size="sm">Currency: {destination.currency}</Text>
        <Text size="sm">Best Season: {destination.bestSeason}</Text>

        <Button
          component={Link}
          to={`/packages?country=${destination.country}`}
          fullWidth
          mt="sm"
        >
          View Packages
        </Button>
      </Stack>
    </Card>
  );
}

export default DestinationCard;