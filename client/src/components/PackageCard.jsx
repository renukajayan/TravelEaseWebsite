import { Badge, Button, Card, Group, Image, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";

function PackageCard({ pkg }) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={pkg.imageUrl || "https://via.placeholder.com/400x220?text=Travel+Package"}
          height={220}
          alt={pkg.title}
        />
      </Card.Section>

      <Stack mt="md" gap="xs">
        <Text fw={700} size="lg">
          {pkg.title || "Untitled Package"}
        </Text>

        <Group>
          <Badge color="blue">${pkg.price ?? 0}</Badge>
          <Badge color="green">{pkg.durationDays ?? 0} days</Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={3}>
          {pkg.description || "No description available."}
        </Text>

        <Text size="sm">
          Destination: {pkg.destinationId?.name || "Unknown"}
        </Text>

        <Text size="sm">
          Available Slots: {pkg.availableSlots ?? 0}
        </Text>

        <Button component={Link} to={`/packages/${pkg._id}`} fullWidth mt="sm">
          View Details
        </Button>
      </Stack>
    </Card>
  );
}

export default PackageCard;