import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import UploadPage from "./pages/Upload";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import TestFunctionality from "./pages/TestFunctionality";
import Loading from "./components/Loading";
import { motion, AnimatePresence } from "framer-motion";

// Simple Layout without authentication for demo
const SimpleLayout = ({ children }) => (
  <Layout>{children}</Layout>
);

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<SimpleLayout><Dashboard /></SimpleLayout>} />
          <Route path="/dashboard/products" element={<SimpleLayout><Products /></SimpleLayout>} />
          <Route path="/dashboard/orders" element={<SimpleLayout><Orders /></SimpleLayout>} />
          <Route path="/dashboard/upload" element={<SimpleLayout><UploadPage /></SimpleLayout>} />
          <Route path="/dashboard/profile" element={<SimpleLayout><Profile /></SimpleLayout>} />
          <Route path="/test" element={<TestFunctionality />} />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;