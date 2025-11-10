import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FaRocket, FaShieldAlt, FaGem, FaBolt, FaCode, FaGlobe, FaUserSecret, FaEyeSlash, FaMask } from 'react-icons/fa';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { Wallet } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const LandingPage = ({ onEnterApp, onViewDocs, darkMode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  
  useEffect(() => {
    const descriptions = [
      { text: "Send encrypted files using wallet addresses as keys.", highlights: [{ start: 5, end: 20, color: "text-cyan-400" }] },
      { text: "Zero identity exposure. Complete anonymity guaranteed.", highlights: [{ start: 0, end: 22, color: "text-purple-400" }] },
      { text: "Each transfer generates unique NFTs for privacy.", highlights: [{ start: 31, end: 35, color: "text-pink-400" }] },
      { text: "Decentralized storage. No central surveillance.", highlights: [{ start: 0, end: 21, color: "text-green-400" }] },
      { text: "Military-grade encryption. Untraceable transfers.", highlights: [{ start: 0, end: 25, color: "text-red-400" }] },
      { text: "Your files. Your keys. Your privacy.", highlights: [{ start: 23, end: 36, color: "text-yellow-400" }] }
    ];
    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let charIndex = 0;
    let timeoutId;
    
    const type = () => {
      
      const desc = descriptions[currentIndex];
      const fullText = desc.text;
      
      if (!isDeleting) {
        currentText = fullText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === fullText.length) {
          timeoutId = setTimeout(() => {
            isDeleting = true;
            type();
          }, 2500);
          
          // Apply highlights to complete text
          let highlightedText = currentText;
          desc.highlights.forEach(h => {
            const before = highlightedText.substring(0, h.start);
            const highlight = highlightedText.substring(h.start, h.end);
            const after = highlightedText.substring(h.end);
            highlightedText = before + `<span class="${h.color} font-semibold">${highlight}</span>` + after;
          });
          
          setTypewriterText(highlightedText);
          return;
        }
      } else {
        currentText = fullText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % descriptions.length;
        }
      }
      
      setTypewriterText(currentText);
      
      const speed = isDeleting ? 15 : 25;
      timeoutId = setTimeout(type, speed);
    };
    
    type();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('MetaMask not found! Please install MetaMask extension.');
      return;
    }

    setConnecting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setIsConnected(true);
      toast.success('MetaMask connected successfully!');
      // Auto-enter app after successful connection
      setTimeout(() => {
        onEnterApp(accounts[0]);
      }, 1000);
    } catch (error) {
      toast.error('Failed to connect MetaMask');
    } finally {
      setConnecting(false);
    }
  };

  const features = [
    {
      icon: <FaUserSecret className="w-8 h-8" />,
      title: "Complete Anonymity",
      description: "No personal data stored. Only wallet addresses for encryption keys",
      color: "from-gray-600 to-gray-800"
    },
    {
      icon: <FaMask className="w-8 h-8" />,
      title: "Stealth NFT Transfer",
      description: "NFTs appear as random art, hiding all transfer metadata",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <FaEyeSlash className="w-8 h-8" />,
      title: "Zero-Knowledge Storage",
      description: "Decentralized storage with no traceable connection to your identity",
      color: "from-cyan-500 to-blue-500"
    },
    {
      icon: <FaShieldAlt className="w-8 h-8" />,
      title: "Untraceable Encryption",
      description: "Military-grade encryption with wallet-based keys for maximum privacy",
      color: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { number: "10K+", label: "Files Transferred", icon: <FaRocket /> },
    { number: "5K+", label: "NFTs Generated", icon: <FaGem /> },
    { number: "99.9%", label: "Uptime", icon: <FaShieldAlt /> },
    { number: "50+", label: "Countries", icon: <FaGlobe /> }
  ];

  return (
    <div className={`min-h-screen font-[Poppins] ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} overflow-hidden`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }, (_, i) => {
          const initialX = (i * 5) % 100;
          const initialY = (i * 7) % 100;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-2 h-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
              animate={{
                x: [0, 60, 0],
                y: [0, -80, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
              style={{
                left: `${initialX}%`,
                top: `${initialY}%`
              }}
            />
          );
        })}
      </div>



      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-4 sm:px-6 py-6 sm:py-8"
        >
          <nav className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FaBolt className="text-white w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className={`text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
                NeutroChain
              </span>
            </motion.div>
            

          </nav>
        </motion.header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-20 text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 border border-gray-500/20">
              <FaUserSecret className="text-cyan-400 w-4 h-4 sm:w-5 sm:h-5" />
              <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Anonymous • Secure • Untraceable
              </span>
              <FaEyeSlash className="text-purple-400 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Secure File Transfer
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Powered by Web3
            </span>
          </motion.h1>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'} min-h-[3rem] flex items-center justify-center`}
          >
            <span className="relative">
              {typewriterText.includes('<span') ? (
                <span dangerouslySetInnerHTML={{ __html: typewriterText }} />
              ) : (
                <span>{typewriterText}</span>
              )}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-cyan-400 ml-1"
              >
                |
              </motion.span>
            </span>
          </motion.div>

          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={connectWallet}
              disabled={connecting || isConnected}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                isConnected 
                  ? 'bg-green-500 text-white hover:shadow-green-500/25' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-cyan-500/25'
              }`}
            >
              {connecting ? (
                <>
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : isConnected ? (
                <>
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>MetaMask Connected</span>
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Authorize MetaMask</span>
                </>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onViewDocs}
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 ${darkMode ? 'text-white border-gray-600 hover:border-gray-500' : 'text-gray-900 border-gray-300 hover:border-gray-400'} text-base sm:text-lg font-semibold rounded-full transition-all duration-300 flex items-center justify-center space-x-2`}
            >
              <FaCode className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>View Docs</span>
            </motion.button>
          </motion.div>
        </section>

        {/* Stats Section */}
        <motion.section
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="container mx-auto px-4 sm:px-6 py-10 sm:py-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`text-center p-4 sm:p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="text-2xl sm:text-3xl mb-2 text-cyan-400">{stat.icon}</div>
                <div className={`text-2xl sm:text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.number}
                </div>
                <div className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="container mx-auto px-4 sm:px-6 py-10 sm:py-20">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Stay
              <span className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent"> Anonymous</span>
            </h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className={`text-lg sm:text-xl max-w-2xl mx-auto px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.6 }}
              >
                Your identity remains completely hidden.
              </motion.span>
              {' '}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.9 }}
                className="text-red-400 font-medium"
              >
                No traces,
              </motion.span>
              {' '}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2.2 }}
                className="text-red-400 font-medium"
              >
                no logs,
              </motion.span>
              {' '}
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2.5 }}
                className="text-red-400 font-medium"
              >
                no surveillance.
              </motion.span>
            </motion.p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className={`p-6 sm:p-8 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'} hover:shadow-2xl transition-all duration-300 cursor-pointer group`}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 sm:mb-6 group-hover:shadow-lg`}>
                  {feature.icon}
                </div>
                
                <h3 className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                
                <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="container mx-auto px-4 sm:px-6 py-10 sm:py-20 text-center"
        >
          <div className={`rounded-3xl p-6 sm:p-12 ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <motion.div
              animate={{ 
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="inline-block mb-6"
            >
              <div className="relative">
                <FaUserSecret className="w-16 h-16 text-gray-500" />
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute -top-2 -right-2"
                >
                  <FaEyeSlash className="w-6 h-6 text-cyan-400" />
                </motion.div>
              </div>
            </motion.div>
            
            <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Ready to Go{' '}
              <motion.span 
                animate={{ 
                  opacity: [1, 0.3, 1, 0.1, 1, 0.5, 1],
                  textShadow: [
                    '0 0 5px rgba(156, 163, 175, 0.5)',
                    '0 0 2px rgba(156, 163, 175, 0.2)',
                    '0 0 8px rgba(156, 163, 175, 0.8)',
                    '0 0 1px rgba(156, 163, 175, 0.1)',
                    '0 0 10px rgba(156, 163, 175, 1)',
                    '0 0 3px rgba(156, 163, 175, 0.3)',
                    '0 0 5px rgba(156, 163, 175, 0.5)'
                  ]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
                className="bg-gradient-to-r from-gray-400 to-gray-600 bg-clip-text text-transparent"
              >
                Invisible
              </motion.span>?
            </h2>
            
            <p className={`text-lg sm:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join the shadow network. Transfer files without leaving a trace.
            </p>
            

          </div>
        </motion.section>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2 }}
          className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} py-8 sm:py-12`}
        >
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FaBolt className="text-white w-3 h-3 sm:w-4 sm:h-4" />
              </div>
              <span className={`text-lg sm:text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent`}>
                NeutroChain
              </span>
            </div>
            <p className={`text-sm sm:text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Decentralized • Secure • Future-Ready
            </p>
          </div>
        </motion.footer>
      </div>
      
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: darkMode ? '#374151' : '#ffffff',
            color: darkMode ? '#ffffff' : '#000000',
            border: darkMode ? '1px solid #4B5563' : '1px solid #E5E7EB',
          },
        }}
      />
    </div>
  );
};

export default LandingPage;