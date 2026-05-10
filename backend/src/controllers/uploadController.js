const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Pastikan folder uploads ada
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// Filter file
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! (jpeg, jpg, png, gif, webp)'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: fileFilter
});

// Upload single image
exports.uploadSingle = (req, res) => {
  upload.single('image')(req, res, function(err) {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select an image to upload' 
      });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({
      success: true,
      data: {
        url: imageUrl,
        filename: req.file.filename
      }
    });
  });
};

// Upload multiple images (max 12)
exports.uploadMultiple = (req, res) => {
  upload.array('images', 12)(req, res, function(err) {
    if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select at least one image' 
      });
    }
    
    const imageUrls = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      filename: file.filename
    }));
    
    res.json({ 
      success: true, 
      data: imageUrls 
    });
  });
};