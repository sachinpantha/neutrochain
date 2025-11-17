import { motion } from 'framer-motion';
import { FaLock, FaEye, FaShieldAlt, FaRocket, FaUpload, FaEnvelope, FaDownload } from 'react-icons/fa';

const FeatureShowcase = ({ darkMode }) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
        
        {/* Left Side - Feature Content */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-6 sm:space-y-8">
            <div>
              <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 lg:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Military-Grade{' '}
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Security
                </span>
              </h2>
              <p className={`text-base sm:text-lg lg:text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your files are protected with the same encryption used by governments and military organizations worldwide.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaLock className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    AES-256 Encryption
                  </h3>
                  <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Bank-level encryption that would take billions of years to crack with current technology.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaEye className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Zero-Knowledge Architecture
                  </h3>
                  <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    We never see your files. Everything is encrypted before it leaves your device.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 10 }}
                className="flex items-start space-x-3 sm:space-x-4"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaShieldAlt className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-1 sm:mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Blockchain Verification
                  </h3>
                  <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Every transfer is verified on the blockchain, ensuring authenticity and preventing tampering.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Desktop Browser Mockup */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative max-w-lg mx-auto">
            {/* Browser Frame */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-t-2xl p-4 shadow-2xl`}>
              {/* Browser Chrome */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className={`flex-1 mx-4 h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded text-xs flex items-center px-3 text-gray-500`}>
                  neutrochain.vercel.app
                </div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-4 h-4 bg-green-400 rounded-full"
                />
              </div>
              
              {/* Screen Content - Exact replica */}
              <div className={`rounded-lg ${darkMode ? 'bg-gray-950' : 'bg-gray-100'} p-4 h-96 relative overflow-hidden`}>
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className={`text-2xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    ⚡ <span className="text-blue-400">Neutro</span>Chain
                  </h1>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
                    Decentralized File Transfer & Encryption System
                  </p>
                  <div className={`mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                    Wallet-based encryption • IPFS storage • NFT verification
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className="mb-4">
                  <div className={`relative flex rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
                    <motion.div
                      animate={{ x: [0, '100%', '200%', '100%', 0] }}
                      transition={{ duration: 8, repeat: Infinity }}
                      className="absolute top-1 bottom-1 w-1/3 bg-blue-500 rounded-lg"
                    />
                    <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-white text-sm">
                      <FaUpload className="w-3 h-3" />
                      Send
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm text-white">
                      <FaEnvelope className="w-3 h-3" />
                      Inbox
                    </div>
                    <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm text-white">
                      <FaDownload className="w-3 h-3" />
                      NFT Decrypt
                    </div>
                  </div>
                </div>

                {/* Upload Card */}
                <div className={`p-4 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                  <h2 className="text-lg font-bold mb-3 text-center text-white">Encrypt & Send File</h2>
                  
                  {/* Connected Wallet */}
                  <div className={`p-2 rounded-lg mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-xs flex items-center gap-2 text-white">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Connected: 0x1234...5678
                    </p>
                  </div>

                  {/* File Upload */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1 text-white">Select File</label>
                    <motion.div
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className={`w-full flex items-center justify-center gap-2 py-3 px-3 rounded-xl border-2 border-dashed cursor-pointer ${
                        darkMode
                          ? "border-gray-600 bg-gray-700/50"
                          : "border-gray-300 bg-gray-100"
                      }`}
                    >
                      <div className={`p-2 rounded-full ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className={`text-xs font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                          Choose File to Send
                        </p>
                      </div>
                    </motion.div>
                  </div>

                  {/* Recipients */}
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1 text-white">Recipients</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      className={`w-full p-2 rounded-lg border text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                    />
                  </div>

                  {/* Send Button */}
                  <button className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 px-3 rounded-lg font-medium text-xs">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send to Inbox
                  </button>
                </div>
              </div>
            </div>
            
            {/* Desktop Base */}
            <div className={`h-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-b-2xl relative`}>
              <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} rounded-t-lg`}></div>
            </div>

            {/* Floating Security Icons */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-r from-red-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <FaLock className="text-white text-xl" />
            </motion.div>

            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, -10, 0]
              }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <FaRocket className="text-white text-xl" />
            </motion.div>
          </div>

          {/* Background Glow */}
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-3xl -z-10"
          />
        </motion.div>

        {/* Mobile-friendly security showcase */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:hidden mt-6 sm:mt-8"
        >
          <div className={`p-4 sm:p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-xl`}>
            <div className="text-center mb-4">
              <div className="inline-flex items-center space-x-2 mb-3">
                <FaShieldAlt className="text-green-400 w-6 h-6" />
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Secured</span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Military-grade protection for your files
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FaLock className="text-white w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>AES-256</span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FaEye className="text-white w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zero-Knowledge</span>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FaShieldAlt className="text-white w-5 h-5" />
                </div>
                <span className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Blockchain</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureShowcase;