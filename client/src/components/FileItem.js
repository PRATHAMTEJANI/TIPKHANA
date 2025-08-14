import React, { useState } from 'react';
import { Download, Trash2, Eye, Calendar, HardDrive } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import FilePreview from './FilePreview';

function FileItem({ file, getFileTypeIcon, formatFileSize }) {
  const { deleteFile, downloadFile } = useFiles();
  const [showPreview, setShowPreview] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      setDeleting(true);
      try {
        await deleteFile(file.id);
      } finally {
        setDeleting(false);
      }
    }
  };

  const handleDownload = () => {
    downloadFile(file.id, file.originalName);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const canPreview = file.fileType.startsWith('image/') || file.fileType === 'application/pdf';

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <div className="file-item">
        <div className="flex items-center space-x-4">
          {/* File Icon */}
          <div className={`file-icon ${getFileTypeIcon(file.fileType)}`}>
            {getFileTypeIcon(file.fileType).charAt(0).toUpperCase()}
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {file.originalName}
            </h4>
            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
              <div className="flex items-center space-x-1">
                <HardDrive className="h-3 w-3" />
                <span>{formatFileSize(file.fileSize)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(file.uploadDate)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {canPreview && (
              <button
                onClick={handlePreview}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Preview"
              >
                <Eye className="h-4 w-4" />
              </button>
            )}
            
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* File Preview Modal */}
      {showPreview && (
        <FilePreview
          file={file}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}

export default FileItem;
