import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  BarChart3,
  Package,
  Upload,
  User,
  LogIn,
  LogOut,
  Settings,
  ChevronDown,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', path: '/', icon: BarChart3, description: 'Welcome page' },
    { label: 'Dashboard', path: '/dashboard', icon: TrendingUp, requiresAuth: true, description: 'Analytics overview' },
    { label: 'Products', path: '/dashboard/products', icon: Package, requiresAuth: true, description: 'Inventory management' },
    { label: 'Upload', path: '/dashboard/upload', icon: Upload, requiresAuth: true, description: 'Media uploads' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsProfileOpen(false);
  };

  const filteredNavItems = navItems.filter(item =>
    !item.requiresAuth || isSignedIn
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50'
          : 'bg-white shadow-lg border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center"
          >
            <Link to="/" className="group flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-12 h-12 rounded-xl overflow-hidden shadow-lg group-hover:shadow-indigo-500/25 transition-shadow duration-300"
              >
                <img
                  src="/src/assets/pi_global_logo.jpeg"
                  alt="PI Global Logo"
                  className="w-full h-full object-cover"
                />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-xl border-2 border-indigo-400/30"
                />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  PI Global
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Purchase Inventory
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {filteredNavItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className={`group relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25'
                      : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <item.icon size={18} />
                  </motion.div>
                  <span className="relative z-10">{item.label}</span>
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <motion.div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full group-hover:w-3/4 transition-all duration-300"
                    whileHover={{ width: "75%" }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {isSignedIn ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="relative"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group flex items-center space-x-3 p-2 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 border border-transparent hover:border-indigo-200"
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow duration-300">
                      <User size={18} className="text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold text-gray-800 leading-tight">
                      {user?.firstName || 'User'}
                    </span>
                    <span className="text-xs text-gray-500 leading-tight">
                      {user?.primaryEmailAddress?.emailAddress?.split('@')[0]}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isProfileOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown size={16} className="text-gray-500 group-hover:text-indigo-600 transition-colors" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-200/50 backdrop-blur-sm py-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                            <User size={20} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 rounded-lg mx-2 my-1"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Settings size={18} />
                        <span>Profile Settings</span>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.02, backgroundColor: "rgba(239, 68, 68, 0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSignOut}
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg w-full text-left mx-2 my-1"
                      >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-indigo-50"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to="/login"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-indigo-500/25"
                  >
                    <Sparkles size={16} />
                    <span>Get Started</span>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 border border-transparent hover:border-indigo-200"
            >
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200/50 shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/src/assets/pi_global_logo.jpeg"
                    alt="PI Global Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="mt-3 text-lg font-bold text-gray-900">PI Global</h3>
                <p className="text-sm text-gray-500">Purchase Inventory</p>
              </motion.div>

              {filteredNavItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    to={item.path}
                    className={`group flex items-center space-x-4 px-4 py-3.5 rounded-2xl text-base font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'text-white bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg'
                        : 'text-gray-700 hover:text-indigo-600 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <item.icon size={22} />
                    </motion.div>
                    <div className="flex flex-col">
                      <span>{item.label}</span>
                      <span className="text-xs opacity-70">{item.description}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}

              {/* Mobile User Menu */}
              {isSignedIn ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="border-t border-gray-200/50 pt-6 mt-6"
                >
                  <div className="flex items-center space-x-4 px-2 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <User size={20} className="text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {user?.primaryEmailAddress?.emailAddress}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Link
                      to="/dashboard/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <Settings size={20} />
                      <span>Profile Settings</span>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 w-full text-left"
                    >
                      <LogOut size={20} />
                      <span>Sign Out</span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="border-t border-gray-200/50 pt-6 mt-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="flex items-center justify-center space-x-3 w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 rounded-2xl text-base font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      <Sparkles size={20} />
                      <span>Get Started</span>
                    </Link>
                  </motion.div>
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium" onClick={() => setIsOpen(false)}>Sign in</Link>
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;