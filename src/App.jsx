import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import UploadPage from "./pages/Upload";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import Loading from "./components/Loading";

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <Loading size="lg" text="Authenticating..." />;
  return isSignedIn ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignIn />
          </div>
        } />
        <Route path="/signup" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <SignUp />
          </div>
        } />
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/dashboard/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/dashboard/upload" element={<PrivateRoute><UploadPage /></PrivateRoute>} />
        <Route path="/dashboard/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;