import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Download, Image, Trash2, Mail } from 'lucide-react';

const Inbox = ({ darkMode, connectedWallet }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInboxFiles();
  }, [connectedWallet]);

  const fetchInboxFiles = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/neutrochain/inbox/${connectedWallet}`);
      setFiles(response.data.files || []);
    } catch (error) {
      // Silently handle error on initial load
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (file) => {
    const byteCharacters = atob(file.fileData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.mimetype });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateNFT = async (fileId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/neutrochain/generate-nft/${fileId}`, {}, {
        responseType: 'blob'
      });
      
      const imageBlob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = 'neutrochain-nft.png';
      a.click();
      URL.revokeObjectURL(imageUrl);
      
      toast.success('NFT generated and downloaded!');
    } catch (error) {
      toast.error('Failed to generate NFT');
    }
  };

  const deleteFile = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/api/neutrochain/inbox/${fileId}`);
      setFiles(files.filter(f => f.id !== fileId));
      toast.success('File deleted');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  if (loading) {
    return (
      <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
        <Mail className="w-8 h-8 mx-auto mb-4 animate-pulse" />
        <p>Loading inbox...</p>
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <Mail className="w-6 h-6" />
        Inbox ({files.length})
      </h2>
      
      {files.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No files received yet
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {files.map((file) => (
            <div key={file.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{file.filename}</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    From: {file.senderAddress.slice(0, 6)}...{file.senderAddress.slice(-4)}
                  </p>
                  {file.message && (
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      "{file.message}"
                    </p>
                  )}
                </div>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => downloadFile(file)}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button
                  onClick={() => generateNFT(file.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg text-sm"
                >
                  <Image className="w-4 h-4" />
                  Generate NFT
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Inbox;