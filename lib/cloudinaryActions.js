const cloudinary = require('cloudinary')
const sha1       = require('sha1')

// Cloudinary is configured via Keystone, see /keystone.js

function generateUploadParams() {
  let timestamp = (Date.now() / 1000 | 0).toString()
  let hash_string = `timestamp=${timestamp}${cloudinary.config().api_secret}`
  return {
    signature: sha1(hash_string),
    upload_url: `https://api.cloudinary.com/v1_1/${cloudinary.config().cloud_name}/image/upload`,
    api_key: cloudinary.config().api_key,
    timestamp: timestamp
  }
}

module.exports = {
  generateUploadParams: generateUploadParams
}
