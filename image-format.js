const path = require("path");
const fs = require("fs");
const glob = require("glob");

// Define image directory
const imgDir = path.join(__dirname, "assets/img");
const imgExtensions = "**/*.{jpg,jpeg,png,gif}";

// Function to delete original images
function deleteOriginalImages() {
    const imagePaths = glob.sync(path.join(imgDir, imgExtensions).replace(/\\/g, "/"));

    if (imagePaths.length === 0) {
        console.log("No original images found to delete.");
        return;
    }

    imagePaths.forEach((imagePath) => {
        try {
            fs.unlinkSync(imagePath);
            console.log(`Deleted: ${imagePath}`);
        } catch (error) {
            console.error(`Error deleting: ${imagePath}`, error);
        }
    });

    console.log("Original images deleted successfully.");
}

// Run deletion process
deleteOriginalImages();
