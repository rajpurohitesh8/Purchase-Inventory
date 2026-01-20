import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, Trash2, Image as ImageIcon, FileText, Download, Eye, Plus, Folder, Search, X, ZoomIn, ZoomOut, RotateCw, Share2, Copy, ExternalLink } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import fileService from "../services/fileService";
import database from "../services/database";

const UploadPage = () => {
  const { showSuccess, showError } = useToast();
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [previewFile, setPreviewFile] = useState(null);
  const [imageZoom, setImageZoom] = useState(1);
  const [imageRotation, setImageRotation] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState(null);
  const fileInputRef = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = () => {
    const files = fileService.getFiles();
    setUploadedFiles(files);
  };

  const categories = [
    { id: 'products', name: 'Product Images', icon: ImageIcon, color: 'indigo' },
    { id: 'documents', name: 'Documents', icon: FileText, color: 'green' },
    { id: 'invoices', name: 'Invoices & Bills', icon: FileText, color: 'blue' },
    { id: 'certificates', name: 'Certificates', icon: FileText, color: 'purple' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file, index) => ({
      id: Date.now() + index,
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      category: selectedCategory,
      status: 'pending'
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileId) => {
    setFiles(files.filter(f => f.id !== fileId));
  };

  const startUpload = async () => {
    if (files.length === 0) {
      showError('Please select files to upload');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await fileService.uploadFile(file.file, file.category);
        
        if (result.success) {
          setUploadProgress(((i + 1) / files.length) * 100);
        } else {
          throw new Error(result.error);
        }
      }
      
      setFiles([]);
      loadFiles();
      showSuccess(`${files.length} files uploaded successfully!`);
    } catch (error) {
      showError('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteUploadedFile = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const result = await fileService.deleteFile(fileId);
      if (result.success) {
        loadFiles();
        showSuccess('File deleted successfully!');
      } else {
        showError('Failed to delete file');
      }
    }
  };

  const downloadFile = async (file) => {
    const result = await fileService.downloadFile(file);
    if (result.success) {
      showSuccess('Download started!');
    } else {
      showError('Download failed');
    }
  };

  const previewFileHandler = (file) => {
    setPreviewFile(file);
    setImageZoom(1);
    setImageRotation(0);
  };

  const closePreview = () => {
    setPreviewFile(null);
  };

  const zoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  const rotateImage = () => {
    setImageRotation(prev => (prev + 90) % 360);
  };

  const shareFile = (file) => {
    setSelectedFileForShare(file);
    setShowShareModal(true);
  };

  const copyFileLink = (file) => {
    navigator.clipboard.writeText(file.url);
    showSuccess('File link copied to clipboard!');
  };

  const isImageFile = (type) => {
    return type.startsWith('image/');
  };

  const isVideoFile = (type) => {
    return type.startsWith('video/');
  };

  const isPDFFile = (type) => {
    return type === 'application/pdf';
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryStyles = (color, isSelected) => {
    const styles = {
      indigo: isSelected ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-gray-300',
      green: isSelected ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-200 hover:border-gray-300',
      blue: isSelected ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 hover:border-gray-300',
      purple: isSelected ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-gray-200 hover:border-gray-300'
    };
    return styles[color] || styles.indigo;
  };

  const getIconStyles = (color, isSelected) => {
    const styles = {
      indigo: isSelected ? 'text-indigo-600' : 'text-gray-400',
      green: isSelected ? 'text-green-600' : 'text-gray-400',
      blue: isSelected ? 'text-blue-600' : 'text-gray-400',
      purple: isSelected ? 'text-purple-600' : 'text-gray-400'
    };
    return styles[color] || styles.indigo;
  };

  const getTextStyles = (color, isSelected) => {
    const styles = {
      indigo: isSelected ? 'text-indigo-700' : 'text-gray-600',
      green: isSelected ? 'text-green-700' : 'text-gray-600',
      blue: isSelected ? 'text-blue-700' : 'text-gray-600',
      purple: isSelected ? 'text-purple-700' : 'text-gray-600'
    };
    return styles[color] || styles.indigo;
  };

  const getFileCardStyles = (color) => {
    const styles = {
      indigo: 'bg-indigo-100 text-indigo-600',
      green: 'bg-green-100 text-green-600',
      blue: 'bg-blue-100 text-blue-600',
      purple: 'bg-purple-100 text-purple-600'
    };
    return styles[color] || 'bg-gray-100 text-gray-600';
  };

  const getBadgeStyles = (color) => {
    const styles = {
      indigo: 'bg-indigo-100 text-indigo-700',
      green: 'bg-green-100 text-green-700',
      blue: 'bg-blue-100 text-blue-700',
      purple: 'bg-purple-100 text-purple-700'
    };
    return styles[color] || 'bg-gray-100 text-gray-700';
  };

  const filteredFiles = uploadedFiles.filter(file => {
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          Media & Document Center
        </motion.h1>
        <p className="text-gray-600">Upload and manage your business files with ease</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-4 rounded-2xl border-2 transition-all ${getCategoryStyles(category.color, selectedCategory === category.id)}`}
          >
            <category.icon 
              className={`w-8 h-8 mx-auto mb-2 ${getIconStyles(category.color, selectedCategory === category.id)}`} 
            />
            <p className={`text-sm font-medium ${getTextStyles(category.color, selectedCategory === category.id)}`}>
              {category.name}
            </p>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
          dragActive 
            ? 'border-indigo-500 bg-indigo-50' 
            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        />
        
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-20 h-20 bg-linear-to-br from-indigo-500 to-purple-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg"
        >
          <UploadCloud size={40} />
        </motion.div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          Drop files here or click to browse
        </h3>
        <p className="text-gray-500 mb-4">
          Supports: Images, PDF, Word, Excel (Max 10MB per file)
        </p>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
        >
          <Plus size={20} />
          Select Files
        </button>
      </motion.div>

      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Files Ready to Upload ({files.length})
            </h3>
            <button
              onClick={startUpload}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              {isUploading ? (
                <React.Fragment>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Uploading... {uploadProgress}%
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <UploadCloud size={20} />
                  Upload All
                </React.Fragment>
              )}
            </button>
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  {file.preview ? (
                    <img src={file.preview} alt={file.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <FileText className="text-indigo-600" size={24} />
                  )}
                </div>
                
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {formatFileSize(file.size)} • {categories.find(c => c.id === file.category)?.name}
                  </p>
                </div>
                
                <button
                  onClick={() => removeFile(file.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                <span className="text-sm text-gray-500">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-linear-to-r from-indigo-600 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Uploaded Files</h3>
              <p className="text-gray-500">Manage your uploaded files and documents</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 bg-white focus:ring-2 focus:ring-indigo-100 outline-none"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6">
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const category = categories.find(c => c.id === file.category);
                
                return (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${getFileCardStyles(category?.color)}`}>
                        <FileIcon size={24} />
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => previewFileHandler(file)}
                          className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => downloadFile(file)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
                          title="Download"
                        >
                          <Download size={16} />
                        </button>
                        <button
                          onClick={() => shareFile(file)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"
                          title="Share"
                        >
                          <Share2 size={16} />
                        </button>
                        <button
                          onClick={() => deleteUploadedFile(file.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 truncate" title={file.name}>
                      {file.name}
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Size</span>
                        <span className="font-medium">{formatFileSize(file.size)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Category</span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getBadgeStyles(category?.color)}`}>
                          {category?.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Uploaded</span>
                        <span className="font-medium">{file.uploadDate}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            }
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No files found matching your criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{previewFile.name}</h3>
                  <p className="text-sm text-gray-500">{formatFileSize(previewFile.size)}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isImageFile(previewFile.type) && (
                    <React.Fragment>
                      <button
                        onClick={zoomOut}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Zoom Out"
                      >
                        <ZoomOut size={20} />
                      </button>
                      <span className="text-sm text-gray-600 min-w-60px text-center">
                        {Math.round(imageZoom * 100)}%
                      </span>
                      <button
                        onClick={zoomIn}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Zoom In"
                      >
                        <ZoomIn size={20} />
                      </button>
                      <button
                        onClick={rotateImage}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                        title="Rotate"
                      >
                        <RotateCw size={20} />
                      </button>
                    </React.Fragment>
                  )}
                  <button
                    onClick={() => downloadFile(previewFile)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={closePreview}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 max-h-[70vh] overflow-auto">
                {isImageFile(previewFile.type) ? (
                  <div className="flex justify-center">
                    <img
                      src={previewFile.url}
                      alt={previewFile.name}
                      className="max-w-full max-h-full object-contain transition-transform duration-200"
                      style={{
                        transform: `scale(${imageZoom}) rotate(${imageRotation}deg)`
                      }}
                    />
                  </div>
                ) : isVideoFile(previewFile.type) ? (
                  <video
                    src={previewFile.url}
                    controls
                    className="w-full max-h-[60vh] rounded-lg"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : isPDFFile(previewFile.type) ? (
                  <iframe
                    src={previewFile.url}
                    className="w-full h-[60vh] rounded-lg border"
                    title={previewFile.name}
                  />
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-400 mb-4" size={64} />
                    <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                    <button
                      onClick={() => downloadFile(previewFile)}
                      className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                      Download File
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedFileForShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Share File</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={selectedFileForShare.url}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm"
                    />
                    <button
                      onClick={() => copyFileLink(selectedFileForShare)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Copy Link"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={() => window.open(selectedFileForShare.url, '_blank')}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Open in New Tab"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={() => copyFileLink(selectedFileForShare)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                  >
                    Copy Link
                  </button>
                  <button
                    onClick={() => downloadFile(selectedFileForShare)}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadPage;