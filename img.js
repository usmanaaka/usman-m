const path = require("path");
const fs = require("fs");
const glob = require("glob");

// Define image directory
const imgDir = path.join(__dirname, "assets/img");

// Supported image formats (except WebP)
const imgExtensions = "**/*.{jpg,jpeg,png,gif}";

// Delete all non-WebP images
function deleteNonWebPImages() {
    const imagePaths = glob.sync(path.join(imgDir, imgExtensions).replace(/\\/g, "/"));

    if (imagePaths.length === 0) {
        console.log("No non-WebP images found to delete.");
        return;
    }

    imagePaths.forEach((imagePath) => {
        try {
            fs.unlinkSync(imagePath);
            console.log(`Deleted: ${imagePath}`);
        } catch (error) {
            console.error(`Error deleting image: ${imagePath}`, error);
        }
    });

    console.log("All non-WebP images deleted successfully.");
}

// Run script
deleteNonWebPImages();
