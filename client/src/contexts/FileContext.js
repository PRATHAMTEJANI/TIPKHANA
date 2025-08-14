import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import toast from 'react-hot-toast';

const FileContext = createContext();

export function useFiles() {
  return useContext(FileContext);
}

export function FileProvider({ children }) {
  const [user] = useAuthState(auth);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('uploadDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // API base URL
  const API_BASE = process.env.REACT_APP_API_URL || 'https://tipkhana.onrender.com';

  // Get auth token
  const getAuthToken = async () => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };

  // Fetch files
  const fetchFiles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${API_BASE}/files`, {
        params: {
          search: searchTerm,
          type: filterType,
          sortBy,
          sortOrder
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        setFiles(response.data.files);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('Failed to fetch files');
    } finally {
      setLoading(false);
    }
  };

  // Upload file
  const uploadFile = async (file, onProgress) => {
    if (!user) return;
    
    try {
      const token = await getAuthToken();
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_BASE}/files/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        }
      });

      if (response.data.success) {
        toast.success('File uploaded successfully!');
        fetchFiles(); // Refresh file list
        return response.data.file;
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      throw error;
    }
  };

  // Delete file
  const deleteFile = async (fileId) => {
    if (!user) return;
    
    try {
      const token = await getAuthToken();
      const response = await axios.delete(`${API_BASE}/files/${fileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        toast.success('File deleted successfully!');
        setFiles(files.filter(file => file.id !== fileId));
        return true;
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
      return false;
    }
  };

  // Download file
  const downloadFile = async (fileId, fileName) => {
    if (!user) return;
    
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${API_BASE}/files/${fileId}/download`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Download started!');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  // Refresh files when dependencies change
  useEffect(() => {
    fetchFiles();
  }, [user, searchTerm, filterType, sortBy, sortOrder]);

  const value = {
    files,
    loading,
    searchTerm,
    filterType,
    sortBy,
    sortOrder,
    setSearchTerm,
    setFilterType,
    setSortBy,
    setSortOrder,
    uploadFile,
    deleteFile,
    downloadFile,
    fetchFiles
  };

  return (
    <FileContext.Provider value={value}>
      {children}
    </FileContext.Provider>
  );
}

