// server/middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// 1. Log in to Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configure the Cloudinary Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    
    if (file.mimetype.startsWith('video/')) {
      return {
        folder: 'growcourse_videos',
        resource_type: 'video', 
        format: 'mp4', // <-- THE MAGIC WORD: Forces every video to become an MP4!
      };
    } else {
      return {
        folder: 'growcourse_images',
        resource_type: 'image',
        allowed_formats: ['jpeg', 'jpg', 'png', 'webp']
      };
    }
  },
});

// 3. Create the Multer upload object
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 100 } // 100MB limit
});

module.exports = upload;