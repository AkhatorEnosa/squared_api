import { v2 as cloudinary } from 'cloudinary';

// Configure with your credentials
cloudinary.config({ 
  cloud_name: `${process.env.CLOUDINARY_CLOUD_NAME}`, 
  api_key: `${process.env.CLOUDINARY_API_KEY}`, 
  api_secret: `${process.env.CLOUDINARY_API_SECRET}` 
});

// Helper function to handle the stream
export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "squared_app_user_posts" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result); 
      }
    );
    
    // Write the buffer to the stream
    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/////////////////////////////////////
// Gets details of an uploaded image
/////////////////////////////////////
// export const getAssetInfo = async (publicId) => {

//     // Return colors in the response
//     const options = {
//     colors: true,
//     };

//     try {
//         // Get details about the asset
//         const result = await cloudinary.api.resource(publicId, options);
//         console.log(result.colors);
//         return result.colors;
//         } catch (error) {
//         console.error(error);
//     }
// };