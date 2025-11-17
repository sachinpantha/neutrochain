import { motion } from 'framer-motion';
import { FaShieldAlt, FaUpload, FaDownload, FaDesktop, FaTablet } from 'react-icons/fa';

const DeviceMockups = ({ darkMode }) => {
  return (
    <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-20">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8 sm:mb-12 lg:mb-16"
      >
        <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 lg:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Desktop{' '}
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Optimized
          </span>
        </h2>
        <p className={`text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-2 sm:px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Professional file transfer experience for desktop users
        </p>
      </motion.div>

      <div className="relative max-w-7xl mx-auto">
        {/* Desktop Mockup */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 mx-auto max-w-4xl hidden sm:block"
        >
          <div className={`relative rounded-t-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} p-4`}>
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
            </div>
            
            {/* Screen Content - Exact replica */}
            <div className={`rounded-lg ${darkMode ? 'bg-gray-950' : 'bg-gray-100'} p-4 min-h-[400px] relative overflow-hidden`}>
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className={`text-3xl font-bold tracking-tight mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
              <div className="mb-6">
                <div className={`relative flex rounded-xl p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
                  <div className="absolute top-1 bottom-1 w-1/3 bg-blue-500 rounded-lg transition-transform duration-300 ease-out translate-x-0" />
                  <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-white text-sm">
                    <FaUpload className="w-3 h-3" />
                    Send
                  </div>
                  <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm text-white">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Inbox
                  </div>
                  <div className="relative z-10 flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium text-sm text-white">
                    <FaDownload className="w-3 h-3" />
                    NFT Decrypt
                  </div>
                </div>
              </div>

              {/* Upload Card */}
              <div className={`p-6 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className="text-lg font-bold mb-4 text-center text-white">Encrypt & Send File</h2>
                
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
                    className={`w-full flex items-center justify-center gap-2 py-4 px-3 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                      darkMode
                        ? "border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-gray-700"
                        : "border-gray-300 bg-gray-100 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                        Choose File to Send
                      </p>
                      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        Click to browse or drag & drop
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Recipients */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-white">Recipients</label>
                    <button className={`px-2 py-1 text-xs rounded-full ${darkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      Single Recipient
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="0x..."
                    className={`w-full p-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                  />
                </div>

                {/* Send Button */}
                <button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-medium transition-colors text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send to Inbox
                </button>
              </div>
            </div>
          </div>
          
          {/* Desktop Base */}
          <div className={`h-8 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'} rounded-b-2xl relative`}>
            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-2 ${darkMode ? 'bg-gray-600' : 'bg-gray-400'} rounded-t-lg`}></div>
          </div>
        </motion.div>



        {/* Tablet Mockup - Right */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="absolute right-0 top-32 z-20 hidden lg:block"
        >
          <div className="relative">
            {/* Tablet Frame */}
            <div className={`w-80 h-96 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-3xl p-3 shadow-2xl transform rotate-12`}>
              <div className={`w-full h-full ${darkMode ? 'bg-gray-900' : 'bg-white'} rounded-2xl relative overflow-hidden`}>
                
                {/* Screen Content - Exact replica */}
                <div className="p-4">
                  {/* Header */}
                  <div className="text-center mb-4">
                    <h1 className={`text-xl font-bold tracking-tight mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      ⚡ <span className="text-blue-400">Neutro</span>Chain
                    </h1>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-xs`}>
                      Decentralized File Transfer & Encryption System
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <div className="mb-4">
                    <div className={`relative flex rounded-lg p-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}>
                      <div className="absolute top-1 bottom-1 w-1/3 bg-blue-500 rounded-md transition-transform duration-300 ease-out translate-x-0" />
                      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-md font-medium text-white text-xs">
                        <FaUpload className="w-2 h-2" />
                        Send
                      </div>
                      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-md font-medium text-xs text-white">
                        <svg className="w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Inbox
                      </div>
                      <div className="relative z-10 flex-1 flex items-center justify-center gap-1 py-1 px-2 rounded-md font-medium text-xs text-white">
                        <FaDownload className="w-2 h-2" />
                        NFT Decrypt
                      </div>
                    </div>
                  </div>

                  {/* Upload Card */}
                  <div className={`p-3 rounded-xl shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <h2 className="text-sm font-bold mb-3 text-center text-white">Encrypt & Send File</h2>
                    
                    {/* File Upload */}
                    <div className="mb-2">
                      <label className="block text-xs font-medium mb-1 text-white">Select File</label>
                      <div className={`w-full flex items-center justify-center gap-2 py-3 px-2 rounded-lg border-2 border-dashed cursor-pointer ${
                        darkMode
                          ? "border-gray-600 bg-gray-700/50"
                          : "border-gray-300 bg-gray-100"
                      }`}>
                        <div className={`p-1 rounded-full ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div className="text-center">
                          <p className={`text-xs font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                            Choose File
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recipients */}
                    <div className="mb-2">
                      <label className="block text-xs font-medium mb-1 text-white">Recipients</label>
                      <input
                        type="text"
                        placeholder="0x..."
                        className={`w-full p-2 rounded-md border text-xs ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}`}
                      />
                    </div>

                    {/* Send Button */}
                    <button className="w-full flex items-center justify-center gap-1 bg-green-500 text-white py-2 px-2 rounded-md font-medium text-xs">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send to Inbox
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -15, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <FaDesktop className="text-white text-lg" />
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile-friendly simple preview */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="sm:hidden mx-auto max-w-sm"
        >
          <div className={`rounded-2xl p-4 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} shadow-2xl`}>
            <div className="text-center mb-4">
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ⚡ <span className="text-blue-400">Neutro</span>Chain
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Secure File Transfer Platform
              </p>
            </div>
            
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900/50' : 'bg-gray-100/50'}`}>
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <FaUpload className="w-4 h-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Upload & Encrypt</span>
              </div>
              
              <div className={`w-full h-16 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} rounded-lg border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-400'} flex items-center justify-center mb-3`}>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Drop files here</span>
              </div>
              
              <button className="w-full bg-green-500 text-white py-2 rounded-lg text-sm font-medium">
                Send Securely
              </button>
            </div>
          </div>
        </motion.div>

        {/* Background Glow Effects */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500/20 rounded-full blur-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default DeviceMockups;