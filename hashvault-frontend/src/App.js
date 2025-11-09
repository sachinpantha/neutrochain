import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import NeutroUpload from "./components/NeutroUpload";
import NeutroDecrypt from "./components/NeutroDecrypt";
import Inbox from "./components/Inbox";
import LandingPage from "./components/LandingPage";
import DocsPage from "./components/DocsPage";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import { Sun, Moon, Upload, Download, Mail } from "lucide-react";
import { Toaster } from 'react-hot-toast';

function App() {
  const headerRef = useRef(null);
  const cardRef = useRef([]);
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('inbox');
  const [showLanding, setShowLanding] = useState(true);
  const [showDocs, setShowDocs] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState('');


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );

      gsap.fromTo(
        cardRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  const toggleTheme = () => setDarkMode((prev) => !prev);
  const enterApp = (walletAddress) => {
    setConnectedWallet(walletAddress);
    setShowLanding(false);
  };
  const showDocsPage = () => {
    setShowLanding(false);
    setShowDocs(true);
  };
  const backToApp = () => setShowDocs(false);

  if (showLanding) {
    return <LandingPage onEnterApp={enterApp} onViewDocs={showDocsPage} darkMode={darkMode} />;
  }

  if (showDocs) {
    return <DocsPage onBack={backToApp} darkMode={darkMode} />;
  }

  return (
    <div
      className={`min-h-screen font-[Poppins] px-4 py-10 transition-colors duration-500 ${darkMode
        ? "bg-gray-950 text-white"
        : "bg-[#f5f3f0] text-gray-800"
        }`}
    >
      {/* Theme Toggle */}
      <div className="fixed top-5 right-5 z-50">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-full shadow-lg transition-colors duration-500 ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-yellow-100 text-orange-600"
            }`}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      <header ref={headerRef} className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          ⚡ <span className="text-blue-400">Neutro</span>Chain
        </h1>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-sm md:text-base`}>
          Decentralized File Transfer & Encryption System
        </p>
        <div className={`mt-4 text-xs ${darkMode ? "text-gray-500" : "text-gray-500"}`}>
          Wallet-based encryption • IPFS storage • NFT verification
        </div>
      </header>

      {/* Toggle Switch */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className={`relative flex rounded-xl p-1 ${darkMode ? "bg-gray-800" : "bg-gray-200"}`}>
          <div
            className={`absolute top-1 bottom-1 w-1/3 bg-blue-500 rounded-lg transition-transform duration-300 ease-out ${
              activeTab === 'inbox' ? 'translate-x-full' : activeTab === 'retrieve' ? 'translate-x-[200%]' : 'translate-x-0'
            }`}
          />
          <button
            onClick={() => setActiveTab('upload')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
              activeTab === 'upload'
                ? 'text-white'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Send
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
              activeTab === 'inbox'
                ? 'text-white'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            Inbox
          </button>
          <button
            onClick={() => setActiveTab('retrieve')}
            className={`relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-colors duration-300 ${
              activeTab === 'retrieve'
                ? 'text-white'
                : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Download className="w-4 h-4" />
            NFT Decrypt
          </button>
        </div>
      </div>

      <main className="max-w-2xl mx-auto">
        <div ref={(el) => (cardRef.current[0] = el)}>
          {activeTab === 'upload' ? (
            <NeutroUpload darkMode={darkMode} connectedWallet={connectedWallet} />
          ) : activeTab === 'inbox' ? (
            <Inbox darkMode={darkMode} connectedWallet={connectedWallet} />
          ) : (
            <NeutroDecrypt darkMode={darkMode} connectedWallet={connectedWallet} />
          )}
        </div>
      </main>
      
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
}

export default App;
