const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/auth');
const { db, storage } = require('../config/firebase');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'application/x-zip-compressed',
      'video/mp4', 'video/avi', 'video/mov',
      'text/plain', 'application/json'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

// Upload file
router.post('/upload', authenticateToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const userId = req.user.uid;
    
    // Create unique filename
    const timestamp = Date.now();
    const fileName = `${userId}_${timestamp}_${originalname}`;
    
    // Upload to Firebase Storage
    const bucket = storage.bucket();
    const file = bucket.file(fileName);
    
    await file.save(buffer, {
      metadata: {
        contentType: mimetype,
        metadata: {
          userId: userId,
          originalName: originalname
        }
      }
    });

    // Make file publicly readable
    await file.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // Save metadata to Firestore
    const fileDoc = {
      userId: userId,
      fileName: fileName,
      originalName: originalname,
      fileType: mimetype,
      fileSize: size,
      downloadUrl: publicUrl,
      uploadDate: new Date(),
      lastModified: new Date()
    };

    const docRef = await db.collection('files').add(fileDoc);

    res.json({
      success: true,
      file: {
        id: docRef.id,
        ...fileDoc
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      error: 'Failed to upload file',
      message: error.message 
    });
  }
});

// Get user's files
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { search, type, sortBy = 'uploadDate', sortOrder = 'desc' } = req.query;

    let query = db.collection('files').where('userId', '==', userId);

    // Apply search filter
    if (search) {
      query = query.where('originalName', '>=', search)
                   .where('originalName', '<=', search + '\uf8ff');
    }

    // Apply type filter
    if (type && type !== 'all') {
      query = query.where('fileType', '==', type);
    }

    // Apply sorting
    if (sortBy === 'uploadDate') {
      query = query.orderBy('uploadDate', sortOrder);
    } else if (sortBy === 'originalName') {
      query = query.orderBy('originalName', sortOrder);
    } else if (sortBy === 'fileSize') {
      query = query.orderBy('fileSize', sortOrder);
    }

    const snapshot = await query.get();
    const files = [];

    snapshot.forEach(doc => {
      files.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      files: files
    });

  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve files',
      message: error.message 
    });
  }
});

// Get single file
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.uid;

    const doc = await db.collection('files').doc(fileId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = doc.data();

    if (fileData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      file: {
        id: doc.id,
        ...fileData
      }
    });

  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve file',
      message: error.message 
    });
  }
});

// Delete file
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.uid;

    const doc = await db.collection('files').doc(fileId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = doc.data();

    if (fileData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete from Firebase Storage
    const bucket = storage.bucket();
    const file = bucket.file(fileData.fileName);
    await file.delete();

    // Delete from Firestore
    await db.collection('files').doc(fileId).delete();

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({ 
      error: 'Failed to delete file',
      message: error.message 
    });
  }
});

// Get file download URL
router.get('/:id/download', authenticateToken, async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.uid;

    const doc = await db.collection('files').doc(fileId).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileData = doc.data();

    if (fileData.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Generate signed URL for secure download
    const bucket = storage.bucket();
    const file = bucket.file(fileData.fileName);
    
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    res.json({
      success: true,
      downloadUrl: signedUrl,
      fileName: fileData.originalName
    });

  } catch (error) {
    console.error('Get download URL error:', error);
    res.status(500).json({ 
      error: 'Failed to generate download URL',
      message: error.message 
    });
  }
});

module.exports = router;
