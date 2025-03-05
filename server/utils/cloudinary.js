const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Upload file to Cloudinary
exports.uploadFile = async (file, folder = '') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `fashion-bags/${folder}`,
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    return {
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
      format: result.format,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Error uploading file to Cloudinary');
  }
};

// Delete file from Cloudinary
exports.deleteFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Error deleting file from Cloudinary');
  }
};

// Create image transformation URL
exports.transformImage = (publicId, options = {}) => {
  const defaultOptions = {
    width: 800,
    height: 800,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  };

  const transformationOptions = { ...defaultOptions, ...options };

  return cloudinary.url(publicId, {
    transformation: [transformationOptions],
    secure: true
  });
};

// Upload multiple files
exports.uploadMultipleFiles = async (files, folder = '') => {
  try {
    const uploadPromises = files.map(file => exports.uploadFile(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Cloudinary multiple upload error:', error);
    throw new Error('Error uploading multiple files to Cloudinary');
  }
};

// Delete multiple files
exports.deleteMultipleFiles = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => exports.deleteFile(publicId));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    console.error('Cloudinary multiple delete error:', error);
    throw new Error('Error deleting multiple files from Cloudinary');
  }
};

// Create signed upload preset
exports.createUploadPreset = async (name, options = {}) => {
  try {
    const defaultOptions = {
      folder: 'fashion-bags',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
      transformation: [
        { width: 1000, height: 1000, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    };

    const presetOptions = { ...defaultOptions, ...options };

    const result = await cloudinary.api.create_upload_preset({
      name,
      ...presetOptions
    });

    return result;
  } catch (error) {
    console.error('Cloudinary create preset error:', error);
    throw new Error('Error creating Cloudinary upload preset');
  }
};

// Get upload preset details
exports.getUploadPreset = async (name) => {
  try {
    const result = await cloudinary.api.upload_preset(name);
    return result;
  } catch (error) {
    console.error('Cloudinary get preset error:', error);
    throw new Error('Error getting Cloudinary upload preset');
  }
};

// Update upload preset
exports.updateUploadPreset = async (name, options) => {
  try {
    const result = await cloudinary.api.update_upload_preset(name, options);
    return result;
  } catch (error) {
    console.error('Cloudinary update preset error:', error);
    throw new Error('Error updating Cloudinary upload preset');
  }
};

// Delete upload preset
exports.deleteUploadPreset = async (name) => {
  try {
    const result = await cloudinary.api.delete_upload_preset(name);
    return result;
  } catch (error) {
    console.error('Cloudinary delete preset error:', error);
    throw new Error('Error deleting Cloudinary upload preset');
  }
};

module.exports = cloudinary;
