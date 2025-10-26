import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// 

const uploadCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null;

        // Upload the file to Cloudinary
        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: ['image', 'raw'] // Allow both image and raw file types,
        });
        console.log('Cloudinary upload result:', result.url);
        return result;

    } catch (error) {
        fs.unlinkSync(localFilePath); // Delete the local file in case of error
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export {uploadCloudinary};