import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { WeatherMapPage } from "./components/WeatherMapPage";
import { SoilHealthPage } from "./components/SoilHealthPage";
import { CropAnalyticsPage } from "./components/CropAnalyticsPage";
import { MarketTrendsPage } from "./components/MarketTrendsPage";
import { ReportsPage } from "./components/ReportsPage";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("dashboard");
  const [user, setUser] = useState(null);

  // Check for existing authentication on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard />;
      case "weather":
        return <WeatherMapPage />;
      case "soil":
        return <SoilHealthPage />;
      case "crop":
        return <CropAnalyticsPage />;
      case "market":
        return <MarketTrendsPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="flex">
        <Sidebar activePage={activePage} onNavigate={setActivePage} />
        {renderPage()}
      </div>
      <Toaster />
    </div>
  );
}
