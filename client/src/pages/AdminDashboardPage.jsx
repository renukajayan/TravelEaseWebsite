import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  Select,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import AppNavbar from "../components/AppNavbar";
import {
  createDestination,
  createPackage,
  deleteDestination,
  deletePackage,
  getDestinations,
  getPackages,
  updateDestination,
  updatePackage,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboardPage() {
  const { token } = useAuth();

  const [destinations, setDestinations] = useState([]);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState("");

  const [editingDestinationId, setEditingDestinationId] = useState(null);
  const [editingPackageId, setEditingPackageId] = useState(null);

  const [destinationForm, setDestinationForm] = useState({
    name: "",
    country: "",
    description: "",
    imageUrl: "",
    currency: "",
    bestSeason: "",
  });

  const [packageForm, setPackageForm] = useState({
    title: "",
    destinationId: "",
    durationDays: "",
    price: "",
    description: "",
    features: "",
    placesIncluded: "",
    imageUrl: "",
    availableSlots: "",
  });

  async function loadData() {
    try {
      setError("");
      const [destinationData, packageData] = await Promise.all([
        getDestinations(),
        getPackages(),
      ]);

      setDestinations(Array.isArray(destinationData) ? destinationData : []);
      setPackages(Array.isArray(packageData) ? packageData : []);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const resetDestinationForm = () => {
    setDestinationForm({
      name: "",
      country: "",
      description: "",
      imageUrl: "",
      currency: "",
      bestSeason: "",
    });
    setEditingDestinationId(null);
  };

  const resetPackageForm = () => {
    setPackageForm({
      title: "",
      destinationId: "",
      durationDays: "",
      price: "",
      description: "",
      features: "",
      placesIncluded: "",
      imageUrl: "",
      availableSlots: "",
    });
    setEditingPackageId(null);
  };

  const handleDestinationChange = (field) => (e) => {
    const value = e?.target?.value ?? "";
    setDestinationForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePackageChange = (field) => (e) => {
    const value = e?.target?.value ?? "";
    setPackageForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCreateOrUpdateDestination = async (e) => {
    e.preventDefault();

    try {
      setError("");

      if (editingDestinationId) {
        await updateDestination(editingDestinationId, destinationForm, token);

        notifications.show({
          title: "Success",
          message: "Destination updated successfully",
        });
      } else {
        await createDestination(destinationForm, token);

        notifications.show({
          title: "Success",
          message: "Destination created successfully",
        });
      }

      resetDestinationForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save destination");
    }
  };

  const handleCreateOrUpdatePackage = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const payload = {
        ...packageForm,
        durationDays: Number(packageForm.durationDays),
        price: Number(packageForm.price),
        availableSlots: Number(packageForm.availableSlots),
        features: packageForm.features
          ? packageForm.features.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
        placesIncluded: packageForm.placesIncluded
          ? packageForm.placesIncluded.split(",").map((item) => item.trim()).filter(Boolean)
          : [],
      };

      if (editingPackageId) {
        await updatePackage(editingPackageId, payload, token);

        notifications.show({
          title: "Success",
          message: "Package updated successfully",
        });
      } else {
        await createPackage(payload, token);

        notifications.show({
          title: "Success",
          message: "Package created successfully",
        });
      }

      resetPackageForm();
      await loadData();
    } catch (err) {
      setError(err.message || "Failed to save package");
    }
  };

  const handleEditDestination = (destination) => {
    setEditingDestinationId(destination._id);
    setDestinationForm({
      name: destination.name || "",
      country: destination.country || "",
      description: destination.description || "",
      imageUrl: destination.imageUrl || "",
      currency: destination.currency || "",
      bestSeason: destination.bestSeason || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEditPackage = (pkg) => {
    setEditingPackageId(pkg._id);
    setPackageForm({
      title: pkg.title || "",
      destinationId: pkg.destinationId?._id || pkg.destinationId || "",
      durationDays: String(pkg.durationDays ?? ""),
      price: String(pkg.price ?? ""),
      description: pkg.description || "",
      features: Array.isArray(pkg.features) ? pkg.features.join(", ") : "",
      placesIncluded: Array.isArray(pkg.placesIncluded)
        ? pkg.placesIncluded.join(", ")
        : "",
      imageUrl: pkg.imageUrl || "",
      availableSlots: String(pkg.availableSlots ?? ""),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteDestination = async (id) => {
    try {
      setError("");
      await deleteDestination(id, token);

      notifications.show({
        title: "Deleted",
        message: "Destination deleted successfully",
      });

      if (editingDestinationId === id) {
        resetDestinationForm();
      }

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete destination");
    }
  };

  const handleDeletePackage = async (id) => {
    try {
      setError("");
      await deletePackage(id, token);

      notifications.show({
        title: "Deleted",
        message: "Package deleted successfully",
      });

      if (editingPackageId === id) {
        resetPackageForm();
      }

      await loadData();
    } catch (err) {
      setError(err.message || "Failed to delete package");
    }
  };

  return (
    <>
      <AppNavbar />
      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Admin Dashboard
        </Title>

        {error && (
          <Alert color="red" mb="lg">
            {error}
          </Alert>
        )}

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="lg" withBorder>
              <Title order={3} mb="md">
                {editingDestinationId ? "Edit Destination" : "Create Destination"}
              </Title>

              <form onSubmit={handleCreateOrUpdateDestination}>
                <Stack>
                  <TextInput
                    label="Name"
                    value={destinationForm.name}
                    onChange={handleDestinationChange("name")}
                    required
                  />
                  <TextInput
                    label="Country"
                    value={destinationForm.country}
                    onChange={handleDestinationChange("country")}
                    required
                  />
                  <Textarea
                    label="Description"
                    value={destinationForm.description}
                    onChange={handleDestinationChange("description")}
                    minRows={3}
                    required
                  />
                  <TextInput
                    label="Image URL"
                    value={destinationForm.imageUrl}
                    onChange={handleDestinationChange("imageUrl")}
                    required
                  />
                  <TextInput
                    label="Currency"
                    value={destinationForm.currency}
                    onChange={handleDestinationChange("currency")}
                    required
                  />
                  <TextInput
                    label="Best Season"
                    value={destinationForm.bestSeason}
                    onChange={handleDestinationChange("bestSeason")}
                    required
                  />

                  <Group>
                    <Button type="submit">
                      {editingDestinationId ? "Update Destination" : "Create Destination"}
                    </Button>

                    {editingDestinationId && (
                      <Button variant="light" color="gray" onClick={resetDestinationForm}>
                        Cancel
                      </Button>
                    )}
                  </Group>
                </Stack>
              </form>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <Paper p="lg" withBorder>
              <Title order={3} mb="md">
                {editingPackageId ? "Edit Package" : "Create Package"}
              </Title>

              <form onSubmit={handleCreateOrUpdatePackage}>
                <Stack>
                  <TextInput
                    label="Title"
                    value={packageForm.title}
                    onChange={handlePackageChange("title")}
                    required
                  />
                  <Select
                    label="Destination"
                    placeholder="Select destination"
                    value={packageForm.destinationId}
                    onChange={(value) =>
                      setPackageForm((prev) => ({
                        ...prev,
                        destinationId: value || "",
                      }))
                    }
                    data={destinations.map((destination) => ({
                      value: destination._id,
                      label: `${destination.name} (${destination.country})`,
                    }))}
                    required
                  />
                  <TextInput
                    label="Duration Days"
                    value={packageForm.durationDays}
                    onChange={handlePackageChange("durationDays")}
                    required
                  />
                  <TextInput
                    label="Price"
                    value={packageForm.price}
                    onChange={handlePackageChange("price")}
                    required
                  />
                  <Textarea
                    label="Description"
                    value={packageForm.description}
                    onChange={handlePackageChange("description")}
                    minRows={3}
                    required
                  />
                  <TextInput
                    label="Features (comma separated)"
                    value={packageForm.features}
                    onChange={handlePackageChange("features")}
                  />
                  <TextInput
                    label="Places Included (comma separated)"
                    value={packageForm.placesIncluded}
                    onChange={handlePackageChange("placesIncluded")}
                  />
                  <TextInput
                    label="Image URL"
                    value={packageForm.imageUrl}
                    onChange={handlePackageChange("imageUrl")}
                    required
                  />
                  <TextInput
                    label="Available Slots"
                    value={packageForm.availableSlots}
                    onChange={handlePackageChange("availableSlots")}
                    required
                  />

                  <Group>
                    <Button type="submit">
                      {editingPackageId ? "Update Package" : "Create Package"}
                    </Button>

                    {editingPackageId && (
                      <Button variant="light" color="gray" onClick={resetPackageForm}>
                        Cancel
                      </Button>
                    )}
                  </Group>
                </Stack>
              </form>
            </Paper>
          </Grid.Col>
        </Grid>

        <Title order={3} mt="xl" mb="md">
          Existing Destinations
        </Title>
        <Stack mb="xl">
          {destinations.map((destination) => (
            <Card key={destination._id} withBorder>
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={600}>{destination.name}</Text>
                  <Text size="sm">{destination.country}</Text>
                  <Text size="xs" c="dimmed">
                    ID: {destination._id}
                  </Text>
                </div>

                <Group>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleEditDestination(destination)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => handleDeleteDestination(destination._id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>

        <Title order={3} mb="md">
          Existing Packages
        </Title>
        <Stack>
          {packages.map((pkg) => (
            <Card key={pkg._id} withBorder>
              <Group justify="space-between" align="flex-start">
                <div>
                  <Text fw={600}>{pkg.title}</Text>
                  <Text size="sm">${pkg.price}</Text>
                  <Text size="xs" c="dimmed">
                    ID: {pkg._id}
                  </Text>
                </div>

                <Group>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={() => handleEditPackage(pkg)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="red"
                    size="xs"
                    onClick={() => handleDeletePackage(pkg._id)}
                  >
                    Delete
                  </Button>
                </Group>
              </Group>
            </Card>
          ))}
        </Stack>
      </Container>
    </>
  );
}

export default AdminDashboardPage;