import React from 'react';
import { X, Download, ExternalLink } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';

function FilePreview({ file, onClose }) {
  const { downloadFile } = useFiles();

  const handleDownload = () => {
    downloadFile(file.id, file.originalName);
  };

  const handleOpenInNewTab = () => {
    window.open(file.downloadUrl, '_blank');
  };

  const renderPreview = () => {
    if (file.fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={file.downloadUrl}
            alt={file.originalName}
            className="max-w-full max-h-96 object-contain rounded-lg shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div className="hidden text-center text-gray-500">
            <p>Image preview not available</p>
            <button
              onClick={handleOpenInNewTab}
              className="btn-primary mt-2"
            >
              Open Image
            </button>
          </div>
        </div>
      );
    }

    if (file.fileType === 'application/pdf') {
      return (
        <div className="w-full h-96">
          <iframe
            src={`${file.downloadUrl}#toolbar=0`}
            className="w-full h-full border-0 rounded-lg"
            title={file.originalName}
          />
        </div>
      );
    }

    return (
      <div className="text-center text-gray-500 py-12">
        <p className="text-lg mb-4">Preview not available for this file type</p>
        <button
          onClick={handleOpenInNewTab}
          className="btn-primary"
        >
          Open File
        </button>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {file.originalName}
            </h3>
            <span className="text-sm text-gray-500">
              ({file.fileType})
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleOpenInNewTab}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title="Open in new tab"
            >
              <ExternalLink className="h-4 w-4" />
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
          {renderPreview()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span>Size: {file.fileSize} bytes</span>
              <span>Uploaded: {new Date(file.uploadDate).toLocaleDateString()}</span>
            </div>
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
