import { motion } from 'framer-motion';
import { useState } from 'react';
import { FaArrowLeft, FaUserSecret, FaWallet, FaUpload, FaDownload, FaShieldAlt, FaGem, FaEyeSlash, FaCode, FaExclamationTriangle, FaChevronDown } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';

const DocsPage = ({ onBack, darkMode }) => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Is NeutroChain completely anonymous?",
      answer: "Yes, NeutroChain doesn't collect or store any personal information. Only wallet addresses are used for encryption, and no identity verification is required."
    },
    {
      question: "What file types are supported?",
      answer: "NeutroChain supports all file types up to 25MB in size. This includes documents, images, videos, archives, and more."
    },
    {
      question: "How long are files stored?",
      answer: "Files are stored on decentralized networks and remain accessible as long as the network maintains them. There's no automatic deletion."
    },
    {
      question: "Can I transfer files to multiple recipients?",
      answer: "Each transfer is encrypted for a specific wallet address. To send to multiple recipients, you need to create separate transfers for each address."
    },
    {
      question: "What's the difference between Inbox and NFT Decrypt?",
      answer: "Inbox shows files sent directly to you for immediate download. NFT Decrypt is for decrypting NFTs you've generated or received from others."
    }
  ];
  const sections = [
    {
      id: 'overview',
      title: 'What is NeutroChain?',
      icon: <FaUserSecret className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p>NeutroChain is a decentralized file transfer system that prioritizes complete anonymity and security. Unlike traditional file sharing services, NeutroChain uses blockchain wallet addresses as encryption keys and generates unique NFTs for each transfer.</p>
          <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-lg p-4 border border-cyan-500/20">
            <h4 className="font-semibold mb-2 flex items-center space-x-2">
              <HiSparkles className="text-cyan-400" />
              <span>Key Features</span>
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Direct Inbox Delivery:</strong> Files sent directly to receiver's inbox</li>
              <li>• <strong>Wallet-Based Authentication:</strong> MetaMask wallet required for access</li>
              <li>• <strong>Optional NFT Generation:</strong> Create NFTs for future decryption</li>
              <li>• <strong>Zero Identity Exposure:</strong> No personal data stored or tracked</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'how-it-works',
      title: 'How It Works',
      icon: <FaCode className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className="font-semibold mb-3 flex items-center space-x-2 text-cyan-400">
                <FaUpload />
                <span>Sender Process</span>
              </h4>
              <ol className="space-y-2 text-sm">
                <li>1. Connect MetaMask wallet</li>
                <li>2. Go to "Send" tab</li>
                <li>3. Select file to send</li>
                <li>4. Enter receiver's wallet address</li>
                <li>5. Add optional message</li>
                <li>6. Click "Send to Inbox"</li>
                <li>7. File is delivered to receiver's inbox</li>
              </ol>
            </div>
            
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h4 className="font-semibold mb-3 flex items-center space-x-2 text-purple-400">
                <FaDownload />
                <span>Receiver Process</span>
              </h4>
              <ol className="space-y-2 text-sm">
                <li>1. Connect MetaMask wallet</li>
                <li>2. Check "Inbox" tab for received files</li>
                <li>3. Click "Download" for direct access</li>
                <li>4. OR click "Generate NFT" for future decryption</li>
                <li>5. NFT can be decrypted later using "NFT Decrypt" tab</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <FaWallet className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Prerequisites</h4>
          <ul className="space-y-2 text-sm">
            <li>• <strong>MetaMask Wallet:</strong> Install MetaMask browser extension</li>
            <li>• <strong>Ethereum Address:</strong> Have an active Ethereum wallet address</li>
            <li>• <strong>Receiver's Address:</strong> Know the recipient's wallet address</li>
          </ul>
          
          <h4 className="font-semibold mt-6">Step-by-Step Guide</h4>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/30'} border-l-4 border-cyan-500`}>
              <h5 className="font-medium mb-2">Step 1: Connect Your Wallet</h5>
              <p className="text-sm">Click "Connect MetaMask" and approve the connection in your MetaMask extension.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/30'} border-l-4 border-purple-500`}>
              <h5 className="font-medium mb-2">Step 2: Choose Your Action</h5>
              <p className="text-sm">Select "Send" to send files, "Inbox" to check received files, or "NFT Decrypt" to decrypt NFTs.</p>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/30' : 'bg-gray-100/30'} border-l-4 border-green-500`}>
              <h5 className="font-medium mb-2">Step 3: Follow the Process</h5>
              <p className="text-sm">Follow the on-screen instructions for your chosen transfer type.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: <FaShieldAlt className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20' : 'bg-green-100/50'} border border-green-500/30`}>
            <h4 className="font-semibold mb-2 text-green-400">Security Features</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>AES-256 Encryption:</strong> Military-grade encryption standard</li>
              <li>• <strong>Wallet-Based Keys:</strong> Your wallet address is the encryption key</li>
              <li>• <strong>No Central Storage:</strong> Files stored on decentralized networks</li>
              <li>• <strong>Steganography:</strong> Data hidden invisibly within NFT images</li>
              <li>• <strong>Zero-Knowledge:</strong> No personal information collected or stored</li>
            </ul>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'} border border-blue-500/30`}>
            <h4 className="font-semibold mb-2 text-blue-400">Privacy Guarantees</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Anonymous Transfers:</strong> No identity verification required</li>
              <li>• <strong>Untraceable:</strong> No logs or tracking mechanisms</li>
              <li>• <strong>Decentralized:</strong> No single point of failure or surveillance</li>
              <li>• <strong>Self-Sovereign:</strong> You control your own encryption keys</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'nft-system',
      title: 'NFT Transfer System',
      icon: <FaGem className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p>NeutroChain can generate unique NFT images for file transfers as a secondary feature. Receivers can choose to generate NFTs from their inbox files for future decryption.</p>
          
          <h4 className="font-semibold">How NFTs Work in NeutroChain</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
              <h5 className="font-medium mb-2">Visual Layer</h5>
              <ul className="text-sm space-y-1">
                <li>• Random character generation</li>
                <li>• 8 different character types</li>
                <li>• Unique traits and colors</li>
                <li>• Collectible artwork</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
              <h5 className="font-medium mb-2">Hidden Layer</h5>
              <ul className="text-sm space-y-1">
                <li>• Encrypted file location</li>
                <li>• Access credentials</li>
                <li>• Transfer metadata</li>
                <li>• Steganographic embedding</li>
              </ul>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20' : 'bg-purple-100/50'} border border-purple-500/30`}>
            <h5 className="font-medium mb-2 text-purple-400">NFT Character Types</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <span>👽 Alien</span>
              <span>🤖 Robot</span>
              <span>🧟 Zombie</span>
              <span>👹 Demon</span>
              <span>👼 Angel</span>
              <span>🧙 Wizard</span>
              <span>🥷 Ninja</span>
              <span>🏴‍☠️ Pirate</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <FaExclamationTriangle className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Common Issues</h4>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20' : 'bg-red-100/50'} border border-red-500/30`}>
              <h5 className="font-medium mb-2 text-red-400">MetaMask Connection Failed</h5>
              <ul className="text-sm space-y-1">
                <li>• Ensure MetaMask extension is installed</li>
                <li>• Check if MetaMask is unlocked</li>
                <li>• Refresh the page and try again</li>
                <li>• Clear browser cache if needed</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100/50'} border border-yellow-500/30`}>
              <h5 className="font-medium mb-2 text-yellow-400">Upload/Download Errors</h5>
              <ul className="text-sm space-y-1">
                <li>• Check file size (max 25MB)</li>
                <li>• Verify wallet address format</li>
                <li>• Ensure stable internet connection</li>
                <li>• Try uploading a different file format</li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-100/50'} border border-blue-500/30`}>
              <h5 className="font-medium mb-2 text-blue-400">Decryption Failed</h5>
              <ul className="text-sm space-y-1">
                <li>• Verify you're using the correct wallet</li>
                <li>• Ensure NFT image is not corrupted</li>
                <li>• Check if you're the intended receiver</li>
                <li>• Contact sender to verify transfer details</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Frequently Asked Questions',
      icon: <FaEyeSlash className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className={`border rounded-lg ${darkMode ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-100/30'}`}>
              <button
                onClick={() => toggleFaq(index)}
                className={`w-full p-4 text-left flex items-center justify-between hover:${darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50'} transition-colors rounded-lg`}
              >
                <h5 className="font-medium">{faq.question}</h5>
                <motion.div
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FaChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === index ? 'auto' : 0,
                  opacity: openFaq === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-4 pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      )
    }
  ];

  return (
    <div className={`min-h-screen font-[Poppins] ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/95' : 'bg-gray-50/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span>Back to App</span>
            </motion.button>
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FaCode className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Documentation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                NeutroChain
              </span> Documentation
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Complete guide to anonymous file transfers
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`p-6 sm:p-8 rounded-2xl ${darkMode ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-sm border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="text-cyan-400">
                    {section.icon}
                  </div>
                  <h2 className="text-2xl font-bold">{section.title}</h2>
                </div>
                
                <div className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {section.content}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12 pt-8 border-t border-gray-700"
          >
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Need help? Your privacy is our priority - no support tickets, no tracking.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DocsPage;