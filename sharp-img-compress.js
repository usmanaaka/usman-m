const glob = require('glob');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');

// Input and output directories
const inputDir = path.join(__dirname, 'assets', 'img');
const outputDir = path.join(__dirname, 'assets', 'img', 'optimized');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Pattern to find all images in subdirectories
const imagePattern = path.join(inputDir, '**/*.{jpg,jpeg,png,gif,webp}').replace(/\\/g, '/');

// Find all image files
const imageFiles = glob.sync(imagePattern);

if (imageFiles.length === 0) {
    console.log('No images found.');
} else {
    console.log('Found image files:', imageFiles);

    // Process each image
    imageFiles.forEach((file) => {
        const filePath = file.replace(/\\/g, '/'); // Normalize path for Windows

        // Generate the output file path to the optimized folder by replacing the input directory with output directory
        let outputFilePath = filePath.replace(inputDir, outputDir);  

        // Modify the file name to indicate optimization (optional but recommended)
        outputFilePath = outputFilePath.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '-optimized$&');  // Append '-optimized' to the filename

        // Debug log to check the paths
        console.log(`Input File: ${filePath}`);
        console.log(`Output File: ${outputFilePath}`);

        // Ensure that the output file path is not the same as the input file path
        if (filePath === outputFilePath) {
            console.log(`Skipping ${file} - Already in the optimized folder.`);
            return; // Skip if the output path is same as input path
        }

        // Ensure the output subdirectories exist
        const outputSubDir = path.dirname(outputFilePath);
        if (!fs.existsSync(outputSubDir)) {
            fs.mkdirSync(outputSubDir, { recursive: true });
        }

        // Optimize image without resizing
        sharp(filePath)
            .toFile(outputFilePath, (err, info) => {
                if (err) {
                    console.error(`Error optimizing image ${file}:`, err);
                } else {
                    console.log(`Optimized image: ${file} -> ${outputFilePath}`);
                }
            });
    });
}
