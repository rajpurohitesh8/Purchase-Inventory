import React, { useState } from "react";
import { motion } from "framer-motion";
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, BarChart3, Upload } from "lucide-react";
import { statsData } from "../data/mockData";
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const container = {
    show: { transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Welcome to PI Global
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-gray-500"
        >
          Here's your inventory overview and key metrics.
        </motion.p>
      </motion.header>

      <motion.div
        variants={container} initial="hidden" animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          { label: "Total Users", val: statsData.totalUsers, icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
          { label: "Products", val: statsData.totalProducts, icon: Package, color: "text-indigo-600", bg: "bg-indigo-100" },
          { label: "Orders", val: statsData.totalOrders, icon: ShoppingCart, color: "text-amber-600", bg: "bg-amber-100" },
          { label: "Revenue", val: `₹${statsData.revenue}`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-100" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={item}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <div className="flex items-end justify-between mt-1">
              <h3 className="text-2xl font-bold text-gray-800">{stat.val}</h3>
              <span className="text-emerald-500 text-xs font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} /> +12%
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {[
          { label: "Add Product", icon: Package, path: "/dashboard/products", color: "bg-indigo-500" },
          { label: "Upload Media", icon: Upload, path: "/dashboard/upload", color: "bg-green-500" },
          { label: "View Reports", icon: BarChart3, path: "/dashboard", color: "bg-blue-500" }
        ].map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = action.path}
            className={`${action.color} text-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex items-center gap-3`}
          >
            <action.icon size={24} />
            <span className="font-medium">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Analytics Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-green-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
          </div>
          <div className="h-64">
            <Line
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                  label: 'Revenue (₹)',
                  data: [12000, 19000, 15000, 25000, 22000, 30000],
                  borderColor: 'rgb(59, 130, 246)',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4,
                  fill: true,
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '₹' + value.toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </motion.div>

        {/* Product Categories */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-purple-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Product Categories</h3>
          </div>
          <div className="h-64">
            <Pie
              data={{
                labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports'],
                datasets: [{
                  data: [35, 25, 20, 15, 5],
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(251, 191, 36, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                  ],
                  borderWidth: 2,
                  borderColor: '#ffffff',
                }]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: { padding: 20, usePointStyle: true }
                  }
                }
              }}
            />
          </div>
        </motion.div>
      </div>

      {/* Monthly Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="text-indigo-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Monthly Performance</h3>
        </div>
        <div className="h-80">
          <Bar
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [
                {
                  label: 'Orders',
                  data: [65, 59, 80, 81, 56, 55, 40, 65, 80, 75, 90, 85],
                  backgroundColor: 'rgba(59, 130, 246, 0.8)',
                  borderColor: 'rgb(59, 130, 246)',
                  borderWidth: 1,
                },
                {
                  label: 'Revenue (₹k)',
                  data: [12, 19, 15, 25, 22, 30, 28, 35, 32, 38, 42, 45],
                  backgroundColor: 'rgba(34, 197, 94, 0.8)',
                  borderColor: 'rgb(34, 197, 94)',
                  borderWidth: 1,
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value, index, values) {
                      return index % 2 === 0 ? value : '';
                    }
                  }
                }
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;