import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  NumberInput,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import AppNavbar from "../components/AppNavbar";
import { createBooking } from "../services/api";
import { useAuth } from "../context/AuthContext";

function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [formData, setFormData] = useState({
    travellerName: user?.name || "",
    travellerEmail: user?.email || "",
    travellerPhone: "",
    numberOfTravellers: 1,
    travelDate: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTextChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleNumberChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      numberOfTravellers: typeof value === "number" && value > 0 ? value : 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!id) {
      setError("Package ID is missing");
      return;
    }

    if (!token) {
      setError("You must be logged in to make a booking");
      return;
    }

    if (!formData.travellerName.trim()) {
      setError("Traveller name is required");
      return;
    }

    if (!formData.travellerEmail.trim()) {
      setError("Traveller email is required");
      return;
    }

  if (!/^[0-9]+$/.test(formData.travellerPhone)) {
    setError("Phone must be numbers only");
    return;
  }

  if (new Date(formData.travelDate) <= new Date()) {
    setError("Travel date must be future");
    return;
  }

    setLoading(true);

    try {
      await createBooking(
        {
          packageId: id,
          travellerName: formData.travellerName,
          travellerEmail: formData.travellerEmail,
          travellerPhone: formData.travellerPhone,
          numberOfTravellers: formData.numberOfTravellers,
          travelDate: formData.travelDate,
          bookingForSelf: true,
        },
        token
      );

      notifications.show({
        title: "Success",
        message: "Booking created successfully",
      });

      navigate("/my-bookings");
    } catch (err) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppNavbar />
      <Container size="sm" py="xl">
        <Paper p="xl" shadow="sm" radius="md" withBorder>
          <Title order={2} mb="lg">
            Book Your Trip
          </Title>

          <form onSubmit={handleSubmit}>
            <Stack>
              {error && <Alert color="red">{error}</Alert>}

              <TextInput
                label="Traveller Name"
                value={formData.travellerName}
                onChange={handleTextChange("travellerName")}
                required
              />

              <TextInput
                label="Traveller Email"
                type="email"
                value={formData.travellerEmail}
                onChange={handleTextChange("travellerEmail")}
                required
              />

              <TextInput
                label="Traveller Phone"
                value={formData.travellerPhone}
                onChange={handleTextChange("travellerPhone")}
                required
              />

              <NumberInput
                label="Number of Travellers"
                value={formData.numberOfTravellers}
                onChange={handleNumberChange}
                min={1}
                required
              />

              <TextInput
                label="Travel Date"
                type="date"
                value={formData.travelDate}
                onChange={handleTextChange("travelDate")}
                required
              />

              <Button type="submit" loading={loading}>
                Confirm Booking
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </>
  );
}

export default BookingPage;