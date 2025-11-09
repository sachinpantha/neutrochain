// FileUpload.js
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import gsap from "gsap";
import { Copy, Check } from "lucide-react";
import io from "socket.io-client";
import toast from 'react-hot-toast';

export default function FileUpload({ darkMode, language }) {
    const [file, setFile] = useState(null);
    const [pin, setPin] = useState("");
    const [ipfsHash, setIpfsHash] = useState("");
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
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

        // Listen for upload progress
        socketRef.current.on('upload-progress', (data) => {
            setProgress(data.progress);
            setProgressMessage(data.message);
        });

        // Listen for upload errors
        socketRef.current.on('upload-error', (data) => {
            setError(data.error);
            setUploading(false);
            setProgress(0);
            setProgressMessage("");
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

    const handleUpload = async () => {
        if (!file || pin.length !== 5) {
            setError("Please select a file and enter a 5-digit PIN.");
            return;
        }

        try {
            setUploading(true);
            setError("");
            setProgress(0);
            setProgressMessage("Initializing...");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("pin", pin);
            formData.append("socketId", socketRef.current.id);

            const res = await axios.post("http://localhost:5000/api/upload", formData, {
                timeout: 60000,
            });

            setIpfsHash(res.data.hash);
            setCopied(false);

            // Show success toast
            toast.success('Evidence Secured!', {
                icon: '📁',
            });

            // Reset progress after successful upload
            setTimeout(() => {
                setProgress(0);
                setProgressMessage("");
            }, 2000);

            gsap.fromTo(
                msgRef.current,
                { opacity: 0, scale: 0.9 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.error || "Upload failed. Please try again.";
            setError(msg);
            setProgress(0);
            setProgressMessage("");
        } finally {
            setUploading(false);
        }
    };

    const copyToClipboard = () => {
        if (!ipfsHash) return;
        navigator.clipboard.writeText(ipfsHash).then(() => {
            setCopied(true);

            gsap.fromTo(
                msgRef.current,
                { rotation: -10, scale: 0.9 },
                { rotation: 0, scale: 1, duration: 0.3, ease: "elastic.out(1, 0.4)" }
            );
            setTimeout(() => setCopied(false), 2000);
        });
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
                📁 {language === 'en' ? 'Submit Legal Evidence' : 'कानुनी प्रमाण पेश गर्नुहोस्'}
            </h2>

            <div className="relative mb-4">
                <input
                    type="file"
                    id="file-upload"
                    onChange={(e) => setFile(e.target.files[0])}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt,.mp4,.mp3,.zip"
                    className="hidden"
                />
                <label
                    htmlFor="file-upload"
                    className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 hover:scale-[1.02] ${darkMode
                        ? "border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-gray-700"
                        : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                    }`}
                >
                    <div className={`p-2 rounded-full ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                            {file ? file.name : (language === 'en' ? 'Choose Evidence File' : 'प्रमाण फाइल छान्नुहोस्')}
                        </p>
                        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                            {language === 'en' ? 'Click to browse files' : 'फाइल ब्राउज गर्न क्लिक गर्नुहोस्'}
                        </p>
                    </div>
                </label>
            </div>
            <p className={`text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {language === 'en' 
                    ? 'Accepted: Documents, Images, Audio, Video, Archives (Max 25MB)'
                    : 'स्वीकार्य: कागजात, छवि, अडियो, भिडियो, आर्काइभ (अधिकतम २५ एमबी)'
                }
            </p>

            <input
                type="password"
                maxLength={5}
                placeholder={language === 'en' ? 'Set Evidence Access PIN' : 'प्रमाण पहुँच पिन सेट गर्नुहोस्'}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                className={`w-full px-4 py-2 mb-4 rounded-md focus:outline-none focus:ring-2 transition-colors duration-500 ${darkMode
                    ? "bg-gray-950 border border-gray-700 focus:ring-blue-400 text-white font-mono tracking-widest"
                    : "bg-[#faf6f0] border border-[#d7cfc5] focus:ring-blue-300 text-gray-800 font-mono tracking-widest"
                    }`}
            />
            <p className={`text-xs mb-3 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {language === 'en'
                    ? '⚠️ Keep this PIN secure - required for evidence access by authorized parties'
                    : '⚠️ यो पिन सुरक्षित राख्नुहोस् - अधिकृत पक्षहरूलाई प्रमाण पहुँचका लागि आवश्यक'
                }
            </p>

            {/* Progress Bar */}
            {uploading && (
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {progressMessage}
                        </span>
                        <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                            {Math.round(progress)}%
                        </span>
                    </div>
                    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
                        <div
                            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={uploading}
                className={`w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${darkMode
                    ? "bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:bg-gray-600 text-white"
                    : "bg-blue-400 hover:bg-blue-300 active:scale-95 disabled:bg-gray-400 text-gray-900"
                    }`}
            >
                {uploading ? (
                    <>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
                        Uploading...
                    </>
                ) : (
                    language === 'en' ? 'Submit Evidence' : 'प्रमाण पेश गर्नुहोस्'
                )}
            </button>

            {ipfsHash && (
                <div ref={msgRef} className="mt-4 flex flex-col gap-2">
                    <span
                        className={`text-sm break-all transition-colors duration-500 ${darkMode ? "text-green-400" : "text-green-600"
                            }`}
                    >
                        {language === 'en' ? 'Case Reference:' : 'मुद्दा सन्दर्भ:'}{" "}
                        <code
                            className={`px-2 py-1 rounded transition-colors duration-500 ${darkMode ? "bg-gray-950" : "bg-[#f5f3f0]"
                                }`}
                        >
                            {ipfsHash}
                        </code>
                    </span>
                    <p className={`text-xs mt-2 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                        {language === 'en'
                            ? '📝 Save this Case Reference for evidence retrieval and court proceedings'
                            : '📝 प्रमाण प्राप्ति र अदालती कार्यवाहीका लागि यो मुद्दा सन्दर्भ सुरक्षित गर्नुहोस्'
                        }
                    </p>
                    <button
                        onClick={copyToClipboard}
                        className={`self-start px-3 py-1 text-sm rounded-md shadow flex items-center gap-2 transition-colors duration-500 ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-[#f5f3f0] hover:bg-[#e7e3dc] text-gray-900"
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" /> Copied Case Reference!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" /> {language === 'en' ? 'Copy Case Reference' : 'मुद्दा सन्दर्भ कपी गर्नुहोस्'}
                            </>
                        )}
                    </button>
                </div>
            )}

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