import { useState } from 'react';
import { X, Download, Eye, FileText, Image, Video, Music, Archive } from 'lucide-react';

const FilePreview = ({ file, onClose, darkMode }) => {
  const [downloading, setDownloading] = useState(false);

  const getFileIcon = (mimetype) => {
    if (mimetype.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimetype.startsWith('video/')) return <Video className="w-6 h-6" />;
    if (mimetype.startsWith('audio/')) return <Music className="w-6 h-6" />;
    if (mimetype.includes('pdf')) return <FileText className="w-6 h-6" />;
    if (mimetype.includes('zip') || mimetype.includes('rar')) return <Archive className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const downloadFile = () => {
    setDownloading(true);
    try {
      const byteCharacters = atob(file.fileData || file.file);
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
    } finally {
      setDownloading(false);
    }
  };

  const renderPreview = () => {
    const fileData = file.fileData || file.file;
    const mimetype = file.mimetype;

    if (mimetype.startsWith('image/')) {
      return (
        <img 
          src={`data:${mimetype};base64,${fileData}`}
          alt={file.filename}
          className="max-w-full max-h-96 object-contain rounded-lg"
        />
      );
    }

    if (mimetype.startsWith('video/')) {
      return (
        <video 
          controls 
          className="max-w-full max-h-96 rounded-lg"
          src={`data:${mimetype};base64,${fileData}`}
        />
      );
    }

    if (mimetype.startsWith('audio/')) {
      return (
        <audio 
          controls 
          className="w-full"
          src={`data:${mimetype};base64,${fileData}`}
        />
      );
    }

    if (mimetype.includes('pdf')) {
      return (
        <iframe
          src={`data:${mimetype};base64,${fileData}`}
          className="w-full h-96 rounded-lg"
          title={file.filename}
        />
      );
    }

    if (mimetype.startsWith('text/')) {
      try {
        const text = atob(fileData);
        return (
          <div className={`p-4 rounded-lg max-h-96 overflow-auto ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <pre className="whitespace-pre-wrap text-sm">{text}</pre>
          </div>
        );
      } catch (e) {
        return <div className="text-center py-8">Cannot preview this text file</div>;
      }
    }

    return (
      <div className="text-center py-12">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
          {getFileIcon(mimetype)}
        </div>
        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Preview not available for this file type
        </p>
        <p className="text-sm mt-2">Click download to save the file</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className={`max-w-4xl w-full max-h-[90vh] overflow-auto rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-500" />
            <div>
              <h3 className="font-semibold">{file.filename}</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {file.mimetype} • {file.senderAddress ? `From: ${file.senderAddress.slice(0, 6)}...${file.senderAddress.slice(-4)}` : 'Decrypted File'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        {file.message && (
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Message:</strong> "{file.message}"
            </p>
          </div>
        )}

        {/* Preview Content */}
        <div className="p-6">
          <div className="flex justify-center mb-4">
            {renderPreview()}
          </div>
        </div>

        {/* Footer */}
        <div className={`flex items-center justify-between p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            File size: {Math.round((file.fileData || file.file).length * 0.75 / 1024)} KB
          </div>
          <button
            onClick={downloadFile}
            disabled={downloading}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Downloading...' : 'Download'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;