import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import AppNavbar from "../components/AppNavbar";
import {
  deleteBooking,
  getMyBookings,
  updateBooking,
} from "../services/api";
import { useAuth } from "../context/AuthContext";

function MyBookingsPage() {
  const { token, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState({
    travellerName: "",
    travellerEmail: "",
    travellerPhone: "",
    numberOfTravellers: 1,
    travelDate: "",
    bookingForSelf: true,
    status: "pending",
  });

  const [rejectingBooking, setRejectingBooking] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError("");

      try {
        const data = await getMyBookings(token);
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [token]);

  const getStatusLabel = (status) => {
    if (status === "confirmed") return "Confirmed";
    if (status === "cancelled") return "Cancelled";
    if (status === "rejected") return "Rejected";
    return "Pending";
  };

  const getStatusColor = (status) => {
    if (status === "confirmed") return "green";
    if (status === "cancelled") return "yellow";
    if (status === "rejected") return "red";
    return "blue";
  };

  const openEditModal = (booking) => {
    setError("");
    setEditingBooking(booking);
    setEditForm({
      travellerName: booking.travellerName || "",
      travellerEmail: booking.travellerEmail || "",
      travellerPhone: booking.travellerPhone || "",
      numberOfTravellers: booking.numberOfTravellers || 1,
      travelDate: booking.travelDate
        ? new Date(booking.travelDate).toISOString().split("T")[0]
        : "",
      bookingForSelf:
        booking.bookingForSelf !== undefined ? booking.bookingForSelf : true,
      status: booking.status || "pending",
    });
  };

  const closeEditModal = () => {
    setEditingBooking(null);
    setEditForm({
      travellerName: "",
      travellerEmail: "",
      travellerPhone: "",
      numberOfTravellers: 1,
      travelDate: "",
      bookingForSelf: true,
      status: "pending",
    });
  };

  const openRejectModal = (booking) => {
    setError("");
    setRejectingBooking(booking);
    setRejectionReason("");
  };

  const closeRejectModal = () => {
    setRejectingBooking(null);
    setRejectionReason("");
  };

  const handleTextChange = (field) => (e) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleNumberChange = (value) => {
    setEditForm((prev) => ({
      ...prev,
      numberOfTravellers: typeof value === "number" && value > 0 ? value : 1,
    }));
  };

  // Validation: phone number must contain only digits
  const isValidPhoneNumber = (phone) => {
    return /^[0-9]+$/.test((phone || "").trim());
  };

  // Validation: travel date must be in the future
  const isFutureDate = (dateString) => {
    if (!dateString) return false;

    const selectedDate = new Date(dateString);
    const today = new Date();

    selectedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return selectedDate > today;
  };

  const buildBookingPayload = (booking, overrides = {}) => ({
    packageId: booking.packageId?._id || booking.packageId,
    travellerName: overrides.travellerName ?? booking.travellerName,
    travellerEmail: overrides.travellerEmail ?? booking.travellerEmail,
    travellerPhone: overrides.travellerPhone ?? booking.travellerPhone,
    numberOfTravellers:
      overrides.numberOfTravellers ?? booking.numberOfTravellers,
    travelDate: overrides.travelDate ?? booking.travelDate,
    bookingForSelf: overrides.bookingForSelf ?? booking.bookingForSelf,
    status: overrides.status ?? booking.status,
    rejectionReason: overrides.rejectionReason ?? booking.rejectionReason ?? "",
  });

  const handleUpdateBooking = async () => {
    if (!editingBooking) return;

    if (!editForm.travellerName.trim()) {
      setError("Traveller name is required");
      return;
    }

    if (!editForm.travellerEmail.trim()) {
      setError("Traveller email is required");
      return;
    }

    if (!editForm.travellerPhone.trim()) {
      setError("Traveller phone is required");
      return;
    }

    if (!isValidPhoneNumber(editForm.travellerPhone)) {
      setError("Phone number must contain numbers only");
      return;
    }

    if (!editForm.numberOfTravellers || editForm.numberOfTravellers < 1) {
      setError("At least 1 traveller is required");
      return;
    }

    if (!editForm.travelDate) {
      setError("Travel date is required");
      return;
    }

    if (!isFutureDate(editForm.travelDate)) {
      setError("Travel date must be a future date");
      return;
    }

    try {
      setError("");

      const response = await updateBooking(
        editingBooking._id,
        buildBookingPayload(editingBooking, {
          travellerName: editForm.travellerName,
          travellerEmail: editForm.travellerEmail,
          travellerPhone: editForm.travellerPhone,
          numberOfTravellers: editForm.numberOfTravellers,
          travelDate: editForm.travelDate,
          bookingForSelf: editForm.bookingForSelf,
          status: editingBooking.status,
        }),
        token
      );

      const updatedBooking = response.booking || response;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === editingBooking._id
            ? {
                ...b,
                ...updatedBooking,
                packageId: updatedBooking.packageId || b.packageId,
                userId: updatedBooking.userId || b.userId,
              }
            : b
        )
      );

      closeEditModal();
    } catch (err) {
      setError(err.message || "Failed to update booking");
    }
  };

  const handleCancelBooking = async (booking) => {
    try {
      setError("");

      const response = await updateBooking(
        booking._id,
        buildBookingPayload(booking, {
          status: "cancelled",
          rejectionReason: "",
        }),
        token
      );

      const updatedBooking = response.booking || response;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? {
                ...b,
                ...updatedBooking,
                status: "cancelled",
                rejectionReason: "",
              }
            : b
        )
      );
    } catch (err) {
      setError(err.message || "Failed to cancel booking");
    }
  };

  const handleDeleteBooking = async (id) => {
    try {
      setError("");
      await deleteBooking(id, token);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete booking");
    }
  };

  const handleAdminConfirm = async (booking) => {
    try {
      setError("");

      const response = await updateBooking(
        booking._id,
        buildBookingPayload(booking, {
          status: "confirmed",
          rejectionReason: "",
        }),
        token
      );

      const updatedBooking = response.booking || response;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === booking._id
            ? {
                ...b,
                ...updatedBooking,
                status: "confirmed",
                rejectionReason: "",
              }
            : b
        )
      );
    } catch (err) {
      setError(err.message || "Failed to confirm booking");
    }
  };

  const handleAdminReject = async () => {
    if (!rejectingBooking) return;

    if (!rejectionReason.trim()) {
      setError("Please enter a rejection reason");
      return;
    }

    try {
      setError("");

      const payload = {
        status: "rejected",
        rejectionReason: rejectionReason.trim(),
      };

      const response = await updateBooking(
        rejectingBooking._id,
        payload,
        token
      );

      const updatedBooking = response.booking || response;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === rejectingBooking._id
            ? {
                ...b,
                ...updatedBooking,
                status: "rejected",
                rejectionReason: rejectionReason.trim(),
              }
            : b
        )
      );

      closeRejectModal();
    } catch (err) {
      setError(err.message || "Failed to reject booking");
    }
  };

  return (
    <>
      <AppNavbar />
      <Container size="md" py="xl">
        <Title order={2} mb="lg">
          {user?.role === "admin" ? "Bookings" : "My Bookings"}
        </Title>

        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : error ? (
          <Alert color="red">{error}</Alert>
        ) : bookings.length === 0 ? (
          <Text>No bookings found.</Text>
        ) : (
          <Stack gap="lg">
            {bookings.map((booking) => (
              <Card key={booking._id} shadow="sm" radius="lg" withBorder p="lg">
                <Group justify="space-between" align="flex-start" mb="sm">
                  <div>
                    <Text fw={700} size="lg">
                      {booking.packageId?.title || "Travel Package"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {booking.packageId?.destinationId?.name ||
                        "Unknown destination"}
                    </Text>
                  </div>

                  <Badge
                    color={getStatusColor(booking.status)}
                    size="lg"
                    radius="sm"
                  >
                    {getStatusLabel(booking.status)}
                  </Badge>
                </Group>

                {user?.role === "admin" && (
                  <Stack gap={2} mb="sm">
                    <Text size="sm">
                      <Text span fw={600}>
                        User:
                      </Text>{" "}
                      {booking.userId?.name || "Unknown"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {booking.userId?.email || "Unknown"}
                    </Text>
                  </Stack>
                )}

                <Stack gap={4}>
                  <Text size="sm">
                    <Text span fw={600}>
                      Travel Date:
                    </Text>{" "}
                    {new Date(booking.travelDate).toLocaleDateString()}
                  </Text>
                  <Text size="sm">
                    <Text span fw={600}>
                      Travellers:
                    </Text>{" "}
                    {booking.numberOfTravellers}
                  </Text>
                </Stack>

                {booking.status === "rejected" && booking.rejectionReason && (
                  <Alert color="red" mt="md">
                    Rejection Reason: {booking.rejectionReason}
                  </Alert>
                )}

                {user?.role !== "admin" && (
                  <Group mt="md">
                    {booking.status !== "cancelled" &&
                      booking.status !== "rejected" && (
                        <>
                          <Button
                            variant="light"
                            onClick={() => openEditModal(booking)}
                          >
                            Update
                          </Button>
                          <Button
                            color="yellow"
                            variant="light"
                            onClick={() => handleCancelBooking(booking)}
                          >
                            Cancel
                          </Button>
                        </>
                      )}

                    <Button
                      color="red"
                      variant="light"
                      onClick={() => handleDeleteBooking(booking._id)}
                    >
                      Delete
                    </Button>
                  </Group>
                )}

                {user?.role === "admin" &&
                  booking.status !== "cancelled" &&
                  booking.status !== "rejected" && (
                    <Group mt="md">
                      {booking.status !== "confirmed" && (
                        <Button
                          color="green"
                          variant="light"
                          onClick={() => handleAdminConfirm(booking)}
                        >
                          Confirm
                        </Button>
                      )}
                      <Button
                        color="red"
                        variant="light"
                        onClick={() => openRejectModal(booking)}
                      >
                        Reject
                      </Button>
                    </Group>
                  )}
              </Card>
            ))}
          </Stack>
        )}

        <Modal
          opened={!!editingBooking}
          onClose={closeEditModal}
          title="Update Booking"
          centered
        >
          <Stack>
            <TextInput
              label="Traveller Name"
              placeholder="Enter traveller name"
              value={editForm.travellerName}
              onChange={handleTextChange("travellerName")}
            />
            <TextInput
              label="Traveller Email"
              placeholder="Enter a valid email"
              value={editForm.travellerEmail}
              onChange={handleTextChange("travellerEmail")}
            />
            <TextInput
              label="Traveller Phone"
              placeholder="Enter numbers only"
              value={editForm.travellerPhone}
              onChange={handleTextChange("travellerPhone")}
            />
            <NumberInput
              label="Number of Travellers"
              value={editForm.numberOfTravellers}
              onChange={handleNumberChange}
              min={1}
            />
            <TextInput
              label="Travel Date"
              type="date"
              value={editForm.travelDate}
              onChange={handleTextChange("travelDate")}
            />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button onClick={handleUpdateBooking}>Save Changes</Button>
            </Group>
          </Stack>
        </Modal>

        <Modal
          opened={!!rejectingBooking}
          onClose={closeRejectModal}
          title="Reject Booking"
          centered
        >
          <Stack>
            <Textarea
              label="Reason for rejection"
              placeholder="Enter reason for rejecting this booking"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.currentTarget.value)}
              minRows={4}
            />

            <Group justify="flex-end">
              <Button variant="light" onClick={closeRejectModal}>
                Cancel
              </Button>
              <Button color="red" onClick={handleAdminReject}>
                Confirm Reject
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </>
  );
}

export default MyBookingsPage;