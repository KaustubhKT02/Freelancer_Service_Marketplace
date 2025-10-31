import {v2 as cloudinary} from 'cloudinary';
import {promises as fs} from 'fs';

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
            resource_type: 'auto',
            folder: 'Freelance Marketplace'
        });
        // console.log('Cloudinary upload result:', result.url);

       await fs.unlink(localFilePath);
        return result;
        

    } catch (error) {
        await fs.unlink(localFilePath);
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

export {uploadCloudinary};