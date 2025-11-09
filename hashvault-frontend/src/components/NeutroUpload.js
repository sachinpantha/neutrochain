import { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Wallet, Send } from 'lucide-react';

const NeutroUpload = ({ darkMode, connectedWallet }) => {
  const [file, setFile] = useState(null);
  const [receiverAddress, setReceiverAddress] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleUpload = async () => {
    if (!file || !receiverAddress || !connectedWallet) {
      toast.error('Please fill all fields');
      return;
    }

    setUploading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const signature = await signer.signMessage('NeutroChain Upload');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('receiverAddress', receiverAddress);
      formData.append('senderAddress', connectedWallet);
      formData.append('signature', signature);
      formData.append('message', message);

      const response = await axios.post('http://localhost:5000/api/neutrochain/send-to-inbox', formData);
      
      setUploadSuccess(true);
      toast.success('File sent to receiver\'s inbox successfully!');
      
      // Reset form
      setFile(null);
      setReceiverAddress('');
      setMessage('');
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (error) {
      toast.error('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Encrypt & Send File</h2>
      
      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Connected: {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
          </p>
        </div>

          <div>
            <label className="block text-sm font-medium mb-2">Select File</label>
            <div className="relative">
              <input
                type="file"
                id="file-upload"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className={`w-full flex items-center justify-center gap-3 py-6 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 hover:scale-[1.02] ${darkMode
                  ? "border-gray-600 bg-gray-700/50 hover:border-blue-400 hover:bg-gray-700"
                  : "border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
                }`}
              >
                <div className={`p-3 rounded-full ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {file ? file.name : 'Choose File to Send'}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Click to browse files
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Receiver's Wallet Address</label>
            <input
              type="text"
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
              placeholder="0x..."
              className={`w-full p-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Message (Optional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a message..."
              className={`w-full p-3 rounded-lg border h-20 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading || !file || !receiverAddress}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {uploading ? (
              <>Sending...</>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send to Inbox
              </>
            )}
          </button>

          {uploadSuccess && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-800' : 'bg-green-100'} border ${darkMode ? 'border-green-600' : 'border-green-300'}`}>
              <h3 className="font-bold mb-2 text-green-400">✅ File Sent Successfully!</h3>
              <p className="text-sm">The receiver will find your file in their inbox.</p>
            </div>
          )}
        </div>
    </div>
  );
};

export default NeutroUpload;