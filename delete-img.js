const path = require("path");
const fs = require("fs");
const glob = require("glob");

// Define the directory to process
const imgDir = path.join(__dirname, "assets/img");

// File extensions to delete except WebP
const imgExtensions = "**/*.{jpg,jpeg,png,gif}";

// Find and delete files
function deleteNonWebPImages() {
    const filesToDelete = glob.sync(path.join(imgDir, imgExtensions).replace(/\\/g, "/"));

    if (filesToDelete.length === 0) {
        console.log("No non-WebP images found.");
        return;
    }

    filesToDelete.forEach((file) => {
        try {
            // Check if a corresponding .webp file exists
            const webpFile = file.replace(path.extname(file), ".webp");

            if (fs.existsSync(webpFile)) {
                // Delete the original file
                fs.unlinkSync(file);
                console.log(`Deleted: ${file}`);
            } else {
                console.log(`Skipping: ${file} (no matching .webp found)`);
            }
        } catch (err) {
            console.error(`Error deleting file: ${file}`, err);
        }
    });

    console.log("Deletion of non-WebP images completed.");
}

// Run the function
deleteNonWebPImages();
