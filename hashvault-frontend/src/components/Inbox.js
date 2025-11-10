import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Download, Image, Trash2, Mail, X, Search } from 'lucide-react';
import { apiService } from '../utils/api';

const Inbox = ({ darkMode, connectedWallet }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchInboxFiles = useCallback(async () => {
    try {
      const response = await apiService.getInbox(connectedWallet);
      setFiles(response.data.files || []);
    } catch (error) {
      // Silently handle error on initial load
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [connectedWallet]);

  useEffect(() => {
    fetchInboxFiles();
  }, [fetchInboxFiles]);

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
      const response = await apiService.generateNFT(fileId);
      
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
      await apiService.deleteFile(fileId);
      setFiles(files.filter(f => f.id !== fileId));
      setDeleteConfirm(null);
      toast.success('File deleted');
    } catch (error) {
      toast.error('Failed to delete file');
    }
  };

  const filteredFiles = files.filter(file => 
    file.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.senderAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (file.message && file.message.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} text-center`}>
        <Mail className="w-8 h-8 mx-auto mb-4 animate-pulse" />
        <p>Loading inbox...</p>
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <Mail className="w-6 h-6" />
        Inbox ({files.length})
      </h2>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="text"
          placeholder="Search files, senders, or messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-8">
          <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No files received yet
          </p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-8">
          <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No files match your search
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <div key={file.id} className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'}`}>
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
                  onClick={() => setDeleteConfirm(file)}
                  className={`p-1 transition-colors ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
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
      
      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`p-6 rounded-lg max-w-sm w-full mx-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Delete File</h3>
              <button onClick={() => setDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete "{deleteConfirm.filename}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className={`flex-1 py-2 px-4 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteFile(deleteConfirm.id)}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inbox;