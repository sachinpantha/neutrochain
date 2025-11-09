// FileDecrypt.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { LockOpen, Loader2 } from "lucide-react";
import io from "socket.io-client";
import toast from 'react-hot-toast';

export default function FileDecrypt({ darkMode, language }) {
    const [hash, setHash] = useState("");
    const [pin, setPin] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState("");

    const cardRef = useRef(null);
    const msgRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
        );

        // Initialize socket connection
        socketRef.current = io("http://localhost:5000");

        // Listen for decrypt progress
        socketRef.current.on('decrypt-progress', (data) => {
            setProgress(data.progress);
            setProgressMessage(data.message);
        });

        // Listen for decrypt errors
        socketRef.current.on('decrypt-error', (data) => {
            setError(data.error);
            setLoading(false);
            setProgress(0);
            setProgressMessage("");
        });

        // Handle connection errors
        socketRef.current.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (error) {
            gsap.fromTo(
                msgRef.current,
                { opacity: 0, y: -10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [error]);

    const handleDecrypt = async () => {
        if (hash.trim() === "" || pin.length !== 5) {
            setError("Please enter both Case Reference and 5-digit PIN.");
            return;
        }

        try {
            setError("");
            setLoading(true);
            setProgress(0);
            setProgressMessage("Initializing...");

            const res = await axios.post(
                "http://localhost:5000/api/decrypt",
                { hash: hash.trim(), pin, socketId: socketRef.current?.id },
                { timeout: 60000 }
            );

            const { filename, mime, file } = res.data;

            // ✅ Convert base64 back to Blob
            const byteChars = atob(file);
            const byteNums = new Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
                byteNums[i] = byteChars.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNums);
            const blob = new Blob([byteArray], { type: mime });

            // ✅ Trigger file download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            // Show success toast
            toast.success('Evidence retrieved successfully!', {
                icon: '🔍',
            });

            // Reset progress after successful decrypt
            setTimeout(() => {
                setProgress(0);
                setProgressMessage("");
            }, 2000);

        } catch (err) {
            console.error(err);
            const status = err.response?.status;
            if (status === 429) {
                setError("⚠️ Too many retrieval attempts. Please wait and try again later.");
            } else {
                const msg =
                    err.response?.data?.error || "❌ Evidence retrieval failed. Wrong PIN or Case Reference.";
                setError(msg);
            }
            setProgress(0);
            setProgressMessage("");
        } finally {
            setLoading(false);
        }
    };

    const handleHashChange = (e) => {
        setHash(e.target.value);
        setError(""); // Clear error when user starts typing
    };

    const handlePinChange = (e) => {
        setPin(e.target.value.replace(/\D/g, ""));
        setError(""); // Clear error when user starts typing
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            handleDecrypt();
        }
    };

    return (
        <section
            ref={cardRef}
            className={`rounded-2xl p-6 shadow-lg border transition-colors duration-500 ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-[#fefcf8] border-[#ded7cc]"
                }`}
        >
            <h2
                className={`text-2xl font-semibold mb-4 transition-colors duration-500 ${darkMode ? "text-white" : "text-gray-800"
                    }`}
            >
                🔍 {language === 'en' ? 'Retrieve Legal Evidence' : 'कानुनी प्रमाण प्राप्त गर्नुहोस्'}
            </h2>

            <input
                type="text"
                placeholder={language === 'en' ? 'Enter Case Reference ID' : 'मुद्दा सन्दर्भ आईडी प्रविष्ट गर्नुहोस्'}
                value={hash}
                onChange={handleHashChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className={`w-full px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 transition-colors duration-500 ${darkMode
                    ? "bg-gray-950 border border-gray-700 focus:ring-blue-400 text-white font-mono disabled:opacity-50"
                    : "bg-[#faf6f0] border border-[#d7cfc5] focus:ring-blue-300 text-gray-800 font-mono disabled:opacity-50"
                    }`}
            />

            <input
                type="password"
                maxLength={5}
                placeholder={language === 'en' ? 'Enter Evidence Access PIN' : 'प्रमाण पहुँच पिन प्रविष्ट गर्नुहोस्'}
                value={pin}
                onChange={handlePinChange}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className={`w-full px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 transition-colors duration-500 ${darkMode
                    ? "bg-gray-950 border border-gray-700 focus:ring-blue-400 text-white font-mono tracking-widest disabled:opacity-50"
                    : "bg-[#faf6f0] border border-[#d7cfc5] focus:ring-blue-300 text-gray-800 font-mono tracking-widest disabled:opacity-50"
                    }`}
            />
            <p className={`text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {language === 'en'
                    ? '⚖️ Enter the Case Reference and PIN provided by the submitting party'
                    : '⚖️ पेश गर्ने पक्षले प्रदान गरेको मुद्दा सन्दर्भ र पिन प्रविष्ट गर्नुहोस्'
                }
            </p>

            {/* Progress Bar */}
            {loading && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {progressMessage}
                        </span>
                        <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className={`w-full rounded-full h-2.5 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <button
                onClick={handleDecrypt}
                disabled={loading || !hash.trim() || pin.length !== 5}
                className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${darkMode
                    ? "bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:bg-gray-600 text-white"
                    : "bg-blue-400 hover:bg-blue-300 active:scale-95 disabled:bg-gray-400 text-gray-900"
                    }`}
            >
                {loading ? (
                    <>
                        <Loader2 className="animate-spin w-5 h-5" /> Retrieving Evidence...
                    </>
                ) : (
                    <>
                        <LockOpen className="w-5 h-5" /> {language === 'en' ? 'Retrieve Evidence' : 'प्रमाण प्राप्त गर्नुहोस्'}
                    </>
                )}
            </button>

            {error && (
                <p
                    ref={msgRef}
                    className={`mt-4 text-sm transition-colors duration-500 ${darkMode ? "text-red-400" : "text-red-600"
                        }`}
                >
                    {error}
                </p>
            )}
        </section>
    );
}