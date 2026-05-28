import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Alert,
  Button,
  Center,
  Container,
  Grid,
  Group,
  Loader,
  Select,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import AppNavbar from "../components/AppNavbar";
import PackageCard from "../components/PackageCard";
import { getPackages } from "../services/api";

function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const countryParam = searchParams.get("country") || "";
    const sortParam = searchParams.get("sort") || "";

    setCountry(countryParam);
    setSort(sortParam);
  }, [searchParams]);

  useEffect(() => {
    async function fetchPackages() {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams();

        if (country) query.append("country", country);
        if (sort) query.append("sort", sort);

        const queryString = query.toString() ? `?${query.toString()}` : "";
        const data = await getPackages(queryString);

        if (Array.isArray(data)) {
          setPackages(data);
        } else {
          setPackages([]);
        }
      } catch (err) {
        console.error("Packages page error:", err);
        setError(err.message || "Failed to load packages");
        setPackages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPackages();
  }, [country, sort]);

  const handleApply = () => {
    const params = {};

    if (country.trim()) params.country = country.trim();
    if (sort) params.sort = sort;

    setSearchParams(params);
  };

  const handleClear = () => {
    setCountry("");
    setSort("");
    setSearchParams({});
  };

  return (
    <>
      <AppNavbar />

      <Container size="lg" py="xl">
        <Title order={2} mb="lg">
          Travel Packages
        </Title>

        <Group mb="lg" align="end">
          <TextInput
            label="Country"
            placeholder="e.g. Japan"
            value={country}
            onChange={(e) => setCountry(e.currentTarget.value)}
          />

          <Select
            label="Sort By"
            placeholder="Select sort"
            value={sort}
            onChange={setSort}
            data={[
              { value: "price_asc", label: "Price Low to High" },
              { value: "price_desc", label: "Price High to Low" },
              { value: "days_asc", label: "Days Low to High" },
              { value: "days_desc", label: "Days High to Low" },
            ]}
            clearable
          />

          <Button onClick={handleApply}>Apply</Button>
          <Button variant="light" onClick={handleClear}>
            Clear
          </Button>
        </Group>

        {error && (
          <Alert color="red" mb="md">
            {error}
          </Alert>
        )}

        {loading ? (
          <Center>
            <Loader />
          </Center>
        ) : packages.length === 0 ? (
          <Text>No packages found.</Text>
        ) : (
          <Grid>
            {packages.map((pkg) => (
              <Grid.Col key={pkg._id} span={{ base: 12, sm: 6, md: 4 }}>
                <PackageCard pkg={pkg} />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}

export default PackagesPage;