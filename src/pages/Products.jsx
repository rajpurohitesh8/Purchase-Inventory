import React, { useState, useEffect } from "react";
import { Search, Plus, Edit2, Trash2, X, CheckCircle, AlertCircle, Filter, Download, Upload, BarChart3, TrendingUp, Package, IndianRupee, Calculator, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../contexts/ToastContext";
import productService from "../services/productService";
import database from "../services/database";

const Products = () => {
  const { showSuccess, showError } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [products, setProducts] = useState([]);
  const [lowStockAlert, setLowStockAlert] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = productService.getProducts();
    setProducts(allProducts);
    const lowStock = productService.getLowStockProducts();
    setLowStockAlert(lowStock);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    status: "Active",
    gst: "18",
    hsn: "",
    minStock: "10",
    supplier: "",
    location: "Mumbai"
  });
  const [formErrors, setFormErrors] = useState({});
  // Indian specific categories
  const indianCategories = [
    "Electronics", "Clothing & Textiles", "Food & Beverages", "Pharmaceuticals",
    "Automotive Parts", "Home & Kitchen", "Books & Stationery", "Jewelry",
    "Agricultural Products", "Handicrafts", "Cosmetics", "Sports & Fitness"
  ];

  const indianStates = [
    "Mumbai", "Delhi", "Bangalore", "Chennai", "Kolkata", "Hyderabad",
    "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur"
  ];

  // Enhanced filter logic
  const filteredData = products.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
                         item.category.toLowerCase().includes(search.toLowerCase()) ||
                         (item.hsn && item.hsn.includes(search));
    const matchesStatus = statusFilter === "All" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Calculate GST and total price
  const calculateGST = (price, gstRate) => {
    return (price * gstRate) / 100;
  };

  const calculateTotalPrice = (price, gstRate) => {
    return price + calculateGST(price, gstRate);
  };

  // Enhanced validation with Indian requirements
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.category.trim()) errors.category = "Category is required";
    if (!formData.price || parseFloat(formData.price) <= 0) errors.price = "Valid price is required";
    if (!formData.stock || parseInt(formData.stock) < 0) errors.stock = "Valid stock quantity is required";
    if (!formData.gst || parseFloat(formData.gst) < 0) errors.gst = "Valid GST rate is required";
    if (formData.hsn && formData.hsn.length !== 8) errors.hsn = "HSN code must be 8 digits";
    return errors;
  };

  // Bulk operations
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    if (window.confirm(`Delete ${selectedProducts.length} selected products?`)) {
      setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      setSelectedProducts([]);
      showSuccess(`${selectedProducts.length} products deleted successfully!`);
    }
  };

  const handleBulkStatusUpdate = (status) => {
    if (selectedProducts.length === 0) return;
    setProducts(products.map(p => 
      selectedProducts.includes(p.id) ? { ...p, status } : p
    ));
    setSelectedProducts([]);
    showSuccess(`${selectedProducts.length} products updated to ${status}!`);
  };

  // Export functionality
  const exportToCSV = () => {
    const headers = ['Name', 'Category', 'Price (₹)', 'Stock', 'GST (%)', 'HSN Code', 'Status', 'Location'];
    const csvData = filteredData.map(p => [
      p.name, p.category, p.price, p.stock, p.gst || '18', p.hsn || '', p.status, p.location || 'Mumbai'
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_export.csv';
    a.click();
    showSuccess('Products exported successfully!');
  };

  // CRUD Functions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      status: "Active",
      gst: "18",
      hsn: "",
      minStock: "10",
      supplier: "",
      location: "Mumbai"
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      stock: product.stock.toString(),
      status: product.status,
      gst: (product.gst || 18).toString(),
      hsn: product.hsn || "",
      minStock: (product.minStock || 10).toString(),
      supplier: product.supplier || "",
      location: product.location || "Mumbai"
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (productId) => {
    const product = products.find(p => p.id === productId);
    if (window.confirm(`Are you sure you want to delete "${product?.name}"?`)) {
      setProducts(products.filter(p => p.id !== productId));
      showSuccess(`Product "${product?.name}" deleted successfully!`);
    }
  };

  const handleSaveProduct = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showError("Please fix the form errors before saving");
      return;
    }

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        gst: parseFloat(formData.gst),
        minStock: parseInt(formData.minStock)
      };

      let result;
      if (editingProduct) {
        result = await productService.updateProduct(editingProduct.id, productData);
        if (result.success) {
          showSuccess(`Product "${formData.name}" updated successfully!`);
        }
      } else {
        result = await productService.saveProduct(productData);
        if (result.success) {
          showSuccess(`Product "${formData.name}" added successfully!`);
        }
      }
      
      if (result.success) {
        setIsModalOpen(false);
        setFormErrors({});
        loadProducts();
      } else {
        showError(result.error || 'Failed to save product');
      }
    } catch (error) {
      showError("Failed to save product. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alerts */}
      {lowStockAlert.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-600" size={24} />
            <div>
              <h3 className="font-semibold text-orange-800">Low Stock Alert</h3>
              <p className="text-orange-700 text-sm">
                {lowStockAlert.length} products are running low on stock
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Products", value: products.length, icon: Package, color: "indigo" },
          { label: "Active Products", value: products.filter(p => p.status === 'Active').length, icon: CheckCircle, color: "green" },
          { label: "Low Stock Items", value: lowStockAlert.length, icon: AlertCircle, color: "orange" },
          { label: "Total Value", value: `₹${products.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString('en-IN')}`, icon: IndianRupee, color: "purple" }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              stat.color === 'indigo' ? 'bg-indigo-100 text-indigo-600' :
              stat.color === 'green' ? 'bg-green-100 text-green-600' :
              stat.color === 'orange' ? 'bg-orange-100 text-orange-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <stat.icon size={24} />
            </div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        {/* Enhanced Header Controls */}
        <div className="p-6 border-b">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Product Inventory</h2>
              <p className="text-gray-500">Manage your products with Indian compliance features</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddProduct}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
              >
                <Plus size={18} />
                Add Product
              </motion.button>
              
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Download size={18} />
                Export CSV
              </button>
              
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Filter size={18} />
                Bulk Actions
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products, HSN..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            <select 
              className="border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            
            <select 
              className="border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="All">All Categories</option>
              {indianCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="text-sm text-gray-500 flex items-center">
              Showing {currentItems.length} of {filteredData.length} products
            </div>
          </div>

          {/* Bulk Actions */}
          {showBulkActions && selectedProducts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  {selectedProducts.length} products selected
                </span>
                <button
                  onClick={() => handleBulkStatusUpdate('Active')}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Mark Active
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('Inactive')}
                  className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
                >
                  Mark Inactive
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  Delete Selected
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Enhanced Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-700 uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(currentItems.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-4">Product Details</th>
                <th className="px-6 py-4">Price & GST</th>
                <th className="px-6 py-4">Stock Info</th>
                <th className="px-6 py-4">HSN & Location</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentItems.length > 0 ? currentItems.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedProducts([...selectedProducts, product.id]);
                        } else {
                          setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.category}</div>
                      {product.supplier && (
                        <div className="text-xs text-blue-600">Supplier: {product.supplier}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-semibold">₹{product.price.toLocaleString('en-IN')}</div>
                      <div className="text-xs text-gray-500">
                        GST: {product.gst || 18}% (₹{calculateGST(product.price, product.gst || 18).toFixed(2)})
                      </div>
                      <div className="text-xs font-medium text-green-600">
                        Total: ₹{calculateTotalPrice(product.price, product.gst || 18).toFixed(2)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className={`font-semibold ${product.stock <= (product.minStock || 10) ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.stock} units
                      </div>
                      <div className="text-xs text-gray-500">Min: {product.minStock || 10}</div>
                      {product.stock <= (product.minStock || 10) && (
                        <div className="text-xs text-red-600 font-medium">⚠️ Low Stock</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      {product.hsn && (
                        <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mb-1">
                          HSN: {product.hsn}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Globe size={12} />
                        {product.location || 'Mumbai'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <Package className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-500">No products found matching your criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <p className="text-indigo-100 text-sm">Indian compliance ready</p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Enter product name"
                    />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="">Select Category</option>
                      {indianCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (₹) *</label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                        placeholder="0.00"
                      />
                    </div>
                    {formErrors.price && <p className="text-red-500 text-xs mt-1">{formErrors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%) *</label>
                    <select
                      value={formData.gst}
                      onChange={(e) => setFormData({...formData, gst: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="0">0% (Exempt)</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Price (₹)</label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium">
                      ₹{formData.price ? calculateTotalPrice(parseFloat(formData.price), parseFloat(formData.gst)).toFixed(2) : '0.00'}
                    </div>
                  </div>
                </div>

                {/* Stock Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock *</label>
                    <input
                      type="number"
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({...formData, stock: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="0"
                    />
                    {formErrors.stock && <p className="text-red-500 text-xs mt-1">{formErrors.stock}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Stock Alert</label>
                    <input
                      type="number"
                      value={formData.minStock}
                      onChange={(e) => setFormData({...formData, minStock: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="10"
                    />
                  </div>
                </div>

                {/* Indian Compliance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HSN Code</label>
                    <input
                      type="text"
                      maxLength="8"
                      value={formData.hsn}
                      onChange={(e) => setFormData({...formData, hsn: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono"
                      placeholder="12345678"
                    />
                    {formErrors.hsn && <p className="text-red-500 text-xs mt-1">{formErrors.hsn}</p>}
                    <p className="text-xs text-gray-500 mt-1">8-digit HSN code for GST compliance</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <select
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      placeholder="Supplier name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                  >
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;