import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Shield, FileText, Lock, Scale } from "lucide-react";

export default function LegalInfo({ darkMode }) {
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(
            cardRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.3 }
        );
    }, []);

    return (
        <section
            ref={cardRef}
            className={`rounded-2xl p-6 shadow-lg border transition-colors duration-500 ${
                darkMode ? "bg-gray-800/80 border-gray-700" : "bg-[#fefcf8] border-[#ded7cc]"
            }`}
        >
            <h2
                className={`text-2xl font-semibold mb-4 transition-colors duration-500 ${
                    darkMode ? "text-white" : "text-gray-800"
                }`}
            >
                ℹ️ About Legal Vault
            </h2>

            <div className="space-y-4">
                <div className="flex items-start gap-3">
                    <Shield className={`w-5 h-5 mt-1 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                    <div>
                        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            Chain of Custody
                        </h3>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Cryptographic proof ensures evidence integrity and maintains legal chain of custody.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <FileText className={`w-5 h-5 mt-1 ${darkMode ? "text-green-400" : "text-green-600"}`} />
                    <div>
                        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            Evidence Integrity
                        </h3>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Immutable blockchain storage prevents evidence tampering and ensures admissibility.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Lock className={`w-5 h-5 mt-1 ${darkMode ? "text-yellow-400" : "text-yellow-600"}`} />
                    <div>
                        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            Authorized Access
                        </h3>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Multi-layer security ensures only authorized legal parties can access evidence.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Scale className={`w-5 h-5 mt-1 ${darkMode ? "text-purple-400" : "text-purple-600"}`} />
                    <div>
                        <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>
                            Legal Compliance
                        </h3>
                        <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                            Meets legal standards for digital evidence and court admissibility requirements.
                        </p>
                    </div>
                </div>
            </div>

            <div className={`mt-6 p-4 rounded-lg ${darkMode ? "bg-gray-900/50" : "bg-blue-50"}`}>
                <p className={`text-sm ${darkMode ? "text-blue-300" : "text-blue-700"}`}>
                    <strong>How it works:</strong> Legal professionals submit evidence securely, receive a Case Reference, 
                    and authorized parties can retrieve evidence using the provided PIN for court proceedings.
                </p>
            </div>
        </section>
    );
}