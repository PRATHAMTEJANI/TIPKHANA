import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc, Download, Trash2, Eye } from 'lucide-react';
import { useFiles } from '../contexts/FileContext';
import FileItem from './FileItem';
import Loading from './Loading';

function FileList() {
  const {
    files,
    loading,
    searchTerm,
    filterType,
    sortBy,
    sortOrder,
    setSearchTerm,
    setFilterType,
    setSortBy,
    setSortOrder
  } = useFiles();

  const [showFilters, setShowFilters] = useState(false);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileTypeIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'document';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'archive';
    if (mimeType.startsWith('video/')) return 'video';
    return 'other';
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="card">
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Your Files ({files.length})
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* File Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="application/pdf">PDFs</option>
                <option value="document">Documents</option>
                <option value="archive">Archives</option>
                <option value="video">Videos</option>
                <option value="other">Others</option>
              </select>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSort('uploadDate')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    sortBy === 'uploadDate'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Date
                  {sortBy === 'uploadDate' && (
                    sortOrder === 'asc' ? <SortAsc className="inline ml-1 h-3 w-3" /> : <SortDesc className="inline ml-1 h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => handleSort('originalName')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    sortBy === 'originalName'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Name
                  {sortBy === 'originalName' && (
                    sortOrder === 'asc' ? <SortAsc className="inline ml-1 h-3 w-3" /> : <SortDesc className="inline ml-1 h-3 w-3" />
                  )}
                </button>
                <button
                  onClick={() => handleSort('fileSize')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    sortBy === 'fileSize'
                      ? 'bg-primary-100 text-primary-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Size
                  {sortBy === 'fileSize' && (
                    sortOrder === 'asc' ? <SortAsc className="inline ml-1 h-3 w-3" /> : <SortDesc className="inline ml-1 h-3 w-3" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File List */}
      {files.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">
            {searchTerm || filterType !== 'all' 
              ? 'No files match your search criteria'
              : 'No files uploaded yet'
            }
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Upload your first file to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => (
            <FileItem
              key={file.id}
              file={file}
              getFileTypeIcon={getFileTypeIcon}
              formatFileSize={formatFileSize}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FileList;
