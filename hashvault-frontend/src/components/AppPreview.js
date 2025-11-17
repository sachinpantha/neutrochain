import { motion } from 'framer-motion';
import { FaUpload, FaDownload, FaEnvelope, FaShieldAlt, FaLock, FaEye } from 'react-icons/fa';

const AppPreview = ({ darkMode }) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-20">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h2 className={`text-4xl md:text-6xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Experience the{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Interface
          </span>
        </h2>
        <p className={`text-xl max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Clean, intuitive, and powerful. See how easy secure file transfer can be.
        </p>
      </motion.div>

      <div className="relative max-w-6xl mx-auto">
        {/* Main Browser Mockup */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          {/* Browser Window */}
          <div className={`rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4 shadow-2xl`}>
            {/* Browser Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className={`ml-4 px-4 py-1 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded text-sm text-gray-500`}>
                  neutrochain.vercel.app
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
                />
                <FaLock className="text-green-400 w-4 h-4" />
              </div>
            </div>

            {/* App Interface */}
            <div className={`rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-white'} p-8 min-h-[600px] relative overflow-hidden`}>
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-purple-500" />
              </div>

              {/* Header */}
              <div className="relative z-10 text-center mb-8">
                <motion.h1
                  animate={{ 
                    textShadow: [
                      '0 0 10px rgba(59, 130, 246, 0.5)',
                      '0 0 20px rgba(59, 130, 246, 0.8)',
                      '0 0 10px rgba(59, 130, 246, 0.5)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                >
                  ⚡ <span className="text-blue-400">Neutro</span>Chain
                </motion.h1>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Decentralized File Transfer & Encryption System
                </p>
              </div>

              {/* Tab Navigation */}
              <div className="relative mb-8">
                <div className={`flex rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} max-w-md mx-auto`}>
                  <motion.div
                    animate={{ x: [0, 100, 200, 100, 0] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1 bottom-1 w-1/3 bg-blue-500 rounded-lg"
                  />
                  <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white">
                    <FaUpload className="w-4 h-4" />
                    Send
                  </div>
                  <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white">
                    <FaEnvelope className="w-4 h-4" />
                    Inbox
                  </div>
                  <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium text-white">
                    <FaDownload className="w-4 h-4" />
                    NFT Decrypt
                  </div>
                </div>
              </div>

              {/* Main Content - Exact replica of NeutroUpload */}
              <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className="text-2xl font-bold mb-6 text-center">Encrypt & Send File</h2>
                
                <div className="space-y-4">
                  {/* Connected Wallet */}
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-sm flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Connected: 0x1234...5678
                    </p>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select File</label>
                    <div className="relative">
                      <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className={`w-full flex items-center justify-center gap-3 py-6 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                          darkMode
                            ? "border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-gray-700"
                            : "border-gray-300 bg-gray-100 hover:border-blue-400 hover:bg-blue-50"
                        }`}
                      >
                        <div className={`p-3 rounded-full ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                            Choose File to Send
                          </p>
                          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            Click to browse or drag & drop
                          </p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Recipients */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">Recipients</label>
                      <button
                        type="button"
                        className={`px-3 py-1 text-xs rounded-full transition-colors ${
                          darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        Single Recipient
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="0x..."
                      className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                    <textarea
                      placeholder="Add a message..."
                      className={`w-full p-3 rounded-lg border h-20 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                    />
                  </div>

                  {/* Send Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send to Inbox
                  </motion.button>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="mt-8 text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.3)',
                      '0 0 40px rgba(59, 130, 246, 0.6)',
                      '0 0 20px rgba(59, 130, 246, 0.3)'
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-full"
                >
                  Start Secure Transfer
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <FaShieldAlt className="text-white text-xl" />
        </motion.div>

        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg"
        >
          <FaLock className="text-white text-xl" />
        </motion.div>

        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-1/4 -right-12 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg"
        >
          <FaEye className="text-white text-sm" />
        </motion.div>

        {/* Background Glow Effects */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default AppPreview;