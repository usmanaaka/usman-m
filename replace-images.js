const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Input directory
const inputDir = path.join(__dirname, 'assets', 'img');

// Pattern to find all images with '_optimized' suffix
const imagePattern = path.join(inputDir, '**/*-optimized.{jpg,jpeg,png,gif,webp}').replace(/\\/g, '/');

// Find all optimized images
const optimizedImages = glob.sync(imagePattern);

if (optimizedImages.length === 0) {
    console.log('No optimized images found.');
} else {
    console.log('Found optimized image files:', optimizedImages);

    // Process each optimized image
    optimizedImages.forEach((optimizedFilePath) => {
        const optimizedFileName = path.basename(optimizedFilePath);
        const originalFilePath = optimizedFilePath.replace('-optimized', '');  // Remove '_optimized' from file name

        // Check if the original file exists
        if (fs.existsSync(originalFilePath)) {
            console.log(`Replacing ${originalFilePath} with ${optimizedFilePath}`);

            // Replace the original image with the optimized version
            fs.rename(optimizedFilePath, originalFilePath, (err) => {
                if (err) {
                    console.error(`Error replacing ${originalFilePath}:`, err);
                } else {
                    console.log(`Replaced ${originalFilePath} with optimized version: ${optimizedFilePath}`);
                }
            });
        } else {
            console.log(`Original file not found for ${optimizedFilePath}`);
        }
    });
}
