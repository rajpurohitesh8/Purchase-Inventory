import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  Package,
  Upload,
  BarChart3,
  Sparkles,
  Moon,
  Sun,
  Filter,
  Download,
  Check,
  X as CloseIcon
} from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext';

const DashboardNavbar = ({ onMenuToggle }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New product added', time: '2 min ago', unread: true, type: 'success' },
    { id: 2, title: 'Inventory low alert', time: '1 hour ago', unread: true, type: 'warning' },
    { id: 3, title: 'Monthly report ready', time: '3 hours ago', unread: false, type: 'info' },
    { id: 4, title: 'System maintenance scheduled', time: '1 day ago', unread: false, type: 'info' },
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, unread: false } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, unread: false })));
  };

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    setIsNotificationsOpen(false);
    // Here you could navigate to relevant pages based on notification type
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Check size={16} className="text-green-500" />;
      case 'warning':
        return <Bell size={16} className="text-yellow-500" />;
      case 'info':
      default:
        return <Bell size={16} className="text-blue-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50/50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50/50';
      case 'info':
      default:
        return 'border-l-blue-500 bg-blue-50/50';
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const quickActions = [
    { label: 'Add Product', icon: Package, path: '/dashboard/products', color: 'from-blue-500 to-cyan-500' },
    { label: 'Upload Media', icon: Upload, path: '/dashboard/upload', color: 'from-green-500 to-emerald-500' },
    { label: 'View Analytics', icon: BarChart3, path: '/dashboard', color: 'from-purple-500 to-pink-500' },
  ];

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/dashboard/products') return 'Product Management';
    if (path === '/dashboard/upload') return 'Media Upload';
    if (path === '/dashboard/profile') return 'User Profile';
    return 'Dashboard';
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Menu Button & Page Title */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
            >
              <Menu size={20} />
            </motion.button>

            <div className="hidden lg:flex items-center space-x-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-10 h-10 rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src="/src/assets/pi_global_logo.jpeg"
                  alt="PI Global Logo"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-bold text-gray-900"
                >
                  {getPageTitle()}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-500"
                >
                  Welcome back, {user?.firstName || 'User'}
                </motion.p>
              </div>
            </div>
          </div>

          {/* Center Section - Quick Actions */}
          <div className="hidden xl:flex items-center space-x-2">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <Link
                  to={action.path}
                  className={`group flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r ${action.color} hover:shadow-lg hover:shadow-opacity-25 transition-all duration-300`}
                >
                  <action.icon size={16} />
                  <span>{action.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Section - Search, Notifications, Profile */}
          <div className="flex items-center space-x-2">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200"
              >
                <Search size={20} />
              </motion.button>

              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-200/50 p-4 z-50"
                  >
                    <div className="relative">
                      <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search products, orders..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Products', 'Orders', 'Analytics', 'Settings'].map((tag) => (
                        <button
                          key={tag}
                          className="px-3 py-1 text-xs bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-lg transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Theme Toggle */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 relative group"
            >
              <motion.div
                animate={{ rotate: isDarkMode ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </div>
            </motion.button>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 relative"
              >
                <motion.div
                  animate={{ rotate: isNotificationsOpen ? 15 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bell size={20} />
                </motion.div>
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm z-50 max-h-96 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                          <Bell size={48} className="mx-auto mb-3 opacity-50" />
                          <p>No notifications yet</p>
                        </div>
                      ) : (
                        notifications.map((notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleNotificationClick(notification)}
                            className={`p-4 border-l-4 cursor-pointer hover:bg-gray-50/50 transition-all duration-200 ${getNotificationColor(notification.type)} ${notification.unread ? 'bg-blue-50/30' : ''}`}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium text-gray-900 truncate ${notification.unread ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                              </div>
                              {notification.unread && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>

                    <div className="p-3 border-t border-gray-100">
                      <Link
                        to="/dashboard/notifications"
                        className="w-full text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium py-2 block"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Profile Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="relative"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-indigo-200"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <User size={16} className="text-white" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                  />
                </div>
                <ChevronDown size={16} className="text-gray-500 hidden sm:block" />
              </motion.button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm py-4 z-50"
                  >
                    <div className="px-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                            <User size={24} className="text-white" />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-3 border-white"></div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {user?.firstName} {user?.lastName}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {user?.primaryEmailAddress?.emailAddress}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-gray-500">Active now</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 py-2">
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center space-x-3 px-3 py-3 text-sm text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 rounded-xl transition-all duration-200"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={18} />
                        <span>Profile Settings</span>
                      </Link>

                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleSignOut();
                          setIsProfileOpen(false);
                        }}
                        className="flex items-center space-x-3 px-3 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 w-full text-left"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default DashboardNavbar;