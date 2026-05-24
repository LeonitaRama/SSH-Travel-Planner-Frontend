import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  type To,
} from "react-router-dom";
import {
  MantineProvider,
  AppShell,
  Burger,
  Group,
  Text,
  Drawer,
  Stack,
  Button,
} from "@mantine/core";
import "@mantine/core/styles.css";

import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import Flights from "./pages/Flights";
import Bookings from "./pages/Bookings";
import BookingItems from "./pages/BookingItems";
import Payments from "./pages/Payments";
import Reviews from "./pages/Reviews";
import Notifications from "./pages/Notifications";
import TravelPackages from "./pages/TravelPackages";
import AiPage from "./pages/AiPage";
import Login from "./pages/Login";

function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>SSH Travel Planner</h1>
      <p>Welcome to the system 🚀</p>
    </div>
  );
}

function AppContent() {
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  const links = [
    { label: "Home", path: "/" },
    { label: "Hotels", path: "/hotels" },
    { label: "Rooms", path: "/rooms" },
    { label: "Flights", path: "/flights" },
    { label: "Bookings", path: "/bookings" },
    { label: "Booking Items", path: "/booking-items" },
    { label: "Payments", path: "/payments" },
    { label: "Reviews", path: "/reviews" },
    { label: "Notifications", path: "/notifications" },
    { label: "Travel Packages", path: "/travel-packages" },
    { label: "AI Assistant", path: "/ai" },
    { label: "Login", path: "/login" },
  ];

  const handleNavigate = (path: To) => {
    navigate(path);
    setOpened(false);
  };

  return (
    <AppShell header={{ height: 60 }} padding='md'>
      {/* Header */}
      <AppShell.Header>
        <Group h='100%' px='md'>
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size='sm'
          />

          <Text
            component={Link}
            to='/'
            fw={700}
            size='lg'
            td='none'
            c='inherit'
          >
            SSH Travel Planner
          </Text>
        </Group>
      </AppShell.Header>

      {/* Drawer Menu */}
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title='Navigation'
        padding='md'
        size='xs'
      >
        <Stack>
          {links.map((link) => (
            <Button
              key={link.path}
              variant='subtle'
              fullWidth
              onClick={() => handleNavigate(link.path)}
            >
              {link.label}
            </Button>
          ))}
        </Stack>
      </Drawer>

      {/* Page Content */}
      <AppShell.Main>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/hotels' element={<Hotels />} />
          <Route path='/rooms' element={<Rooms />} />
          <Route path='/flights' element={<Flights />} />
          <Route path='/bookings' element={<Bookings />} />
          <Route path='/booking-items' element={<BookingItems />} />
          <Route path='/payments' element={<Payments />} />
          <Route path='/reviews' element={<Reviews />} />
          <Route path='/notifications' element={<Notifications />} />
          <Route path='/travel-packages' element={<TravelPackages />} />
          <Route path='/ai' element={<AiPage />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </MantineProvider>
  );
}
