import React from 'react';
import FileUpload from '../components/FileUpload';
import FileList from '../components/FileList';

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cloud Storage</h1>
        <p className="mt-2 text-gray-600">
          Upload, manage, and access your files from anywhere
        </p>
      </div>

      <div className="space-y-8">
        <FileUpload />
        <FileList />
      </div>
    </div>
  );
}

export default Dashboard;
