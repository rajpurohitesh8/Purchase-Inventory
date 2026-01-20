import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, CheckCircle, Trash2, Image as ImageIcon } from "lucide-react";

const UploadPage = () => {
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setSuccess(false);
    }
  };

  const startUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Media Center</h2>
        <p className="text-gray-500">Upload your product assets here</p>
      </div>

      <AnimatePresence mode="wait">
        {!success ? (
          <motion.div
            key="upload-box"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-\[2rem\] border-2 border-dashed border-indigo-100 shadow-2xl shadow-indigo-100 text-center"
          >
            {!preview ? (
              <div className="relative group cursor-pointer">
                <input type="file" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
                <motion.div whileHover={{ scale: 1.1 }} className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <UploadCloud size={32} />
                </motion.div>
                <p className="text-lg font-bold text-gray-700">Drop files here</p>
                <p className="text-sm text-gray-400">or click to browse (Max 5MB)</p>
              </div>
            ) : (
              <div className="space-y-6">
                <motion.img initial={{ y: 10 }} animate={{ y: 0 }} src={preview} className="w-full h-64 object-cover rounded-2xl shadow-md" />
                <div className="flex gap-4">
                  <button onClick={() => setPreview(null)} className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition">Remove</button>
                  <button onClick={startUpload} className="flex-2 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 overflow-hidden relative">
                    {isUploading ? "Uploading..." : "Upload Now"}
                    {isUploading && <motion.div className="absolute bottom-0 left-0 h-1 bg-white" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success-box"
            initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-10 rounded-\[2rem\] border border-emerald-100 shadow-2xl shadow-emerald-100 text-center"
          >
            <motion.div initial={{ rotate: -20 }} animate={{ rotate: 0 }} className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
              <CheckCircle size={40} />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800">Perfect!</h3>
            <p className="text-gray-500 mb-8">Asset has been successfully synchronized.</p>
            <button onClick={() => setSuccess(false)} className="text-indigo-600 font-bold hover:underline">Upload another file</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadPage;