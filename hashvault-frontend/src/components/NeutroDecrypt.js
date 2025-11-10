import { useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { Download, Wallet, FileText } from 'lucide-react';
import { apiService } from '../utils/api';

const NeutroDecrypt = ({ darkMode, connectedWallet }) => {
  const [nftFile, setNftFile] = useState(null);
  const [nftPreview, setNftPreview] = useState(null);
  const [decrypting, setDecrypting] = useState(false);
  const [decryptedData, setDecryptedData] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleNftUpload = (e) => {
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setNftFile(file);
      const previewUrl = URL.createObjectURL(file);
      setNftPreview(previewUrl);
      toast.success('NFT image loaded successfully!');
    } else {
      toast.error('Please select a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handleDecrypt = async () => {
    if (!nftFile || !connectedWallet) {
      toast.error('Please upload NFT image');
      return;
    }

    setDecrypting(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      const signature = await signer.signMessage('NeutroChain Decrypt');

      const formData = new FormData();
      formData.append('nftImage', nftFile);
      formData.append('receiverAddress', connectedWallet);
      formData.append('signature', signature);

      const response = await apiService.decryptDownload(formData);

      setDecryptedData(response.data);
      toast.success('File decrypted successfully!');
    } catch (error) {
      toast.error('Decryption failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setDecrypting(false);
    }
  };

  const downloadFile = () => {
    if (!decryptedData) return;

    const byteCharacters = atob(decryptedData.file);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: decryptedData.mimetype });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = decryptedData.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center">Decrypt & Receive File</h2>
      
      <div className="space-y-4">
        <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className="text-sm flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Connected: {connectedWallet.slice(0, 6)}...{connectedWallet.slice(-4)}
          </p>
        </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload NFT Image</label>
            <div className="relative">
              <input
                type="file"
                id="nft-upload"
                accept="image/*"
                onChange={handleNftUpload}
                className="hidden"
              />
              <label
                htmlFor="nft-upload"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full flex items-center justify-center gap-3 py-6 px-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  isDragging
                    ? darkMode
                      ? "border-purple-400 bg-purple-900/20 scale-[1.02]"
                      : "border-purple-400 bg-purple-100 scale-[1.02]"
                    : darkMode
                    ? "border-gray-600 bg-gray-700/50 hover:border-purple-400 hover:bg-gray-700"
                    : "border-gray-300 bg-gray-100 hover:border-purple-400 hover:bg-purple-50"
                }`}
              >
                <div className={`p-3 rounded-full ${darkMode ? "bg-purple-600" : "bg-purple-500"}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>
                    {nftFile ? nftFile.name : isDragging ? 'Drop NFT image here' : 'Choose NFT Image'}
                  </p>
                  <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {isDragging ? 'Release to upload' : 'Click to browse or drag & drop image files'}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {nftPreview && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <h3 className="font-bold mb-2">NFT Preview:</h3>
              <img src={nftPreview} alt="NFT Preview" className="w-full rounded-lg" />
            </div>
          )}

          <button
            onClick={handleDecrypt}
            disabled={decrypting || !nftFile}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {decrypting ? (
              <>Decrypting...</>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Decrypt File
              </>
            )}
          </button>

          {decryptedData && (
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <h3 className="font-bold mb-2">✅ Decryption Successful!</h3>
              <p className="text-sm mb-2">File: {decryptedData.filename}</p>
              {decryptedData.message && (
                <p className="text-sm mb-2">Message: "{decryptedData.message}"</p>
              )}
              <button
                onClick={downloadFile}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download File
              </button>
            </div>
          )}
        </div>
    </div>
  );
};

export default NeutroDecrypt;