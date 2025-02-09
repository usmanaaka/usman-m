const path = require("path");
const fs = require("fs");
const glob = require("glob");
const sharp = require("sharp");

// Define paths
const imgDir = path.join(__dirname, "assets/img");
const htmlFiles = glob.sync(path.join(__dirname, "**/*.html").replace(/\\/g, "/"));
const cssFiles = glob.sync(path.join(__dirname, "**/*.css").replace(/\\/g, "/"));
const jsFiles = glob.sync(path.join(__dirname, "**/*.js").replace(/\\/g, "/"));

// File extensions to process
const imgExtensions = "**/*.{jpg,jpeg,png,gif}";

// Convert images to WebP and update references
async function convertImagesAndUpdate() {
    const imagePaths = glob.sync(path.join(imgDir, imgExtensions).replace(/\\/g, "/"));

    if (imagePaths.length === 0) {
        console.log("No images found to convert.");
        return;
    }

    for (const imagePath of imagePaths) {
        const ext = path.extname(imagePath).toLowerCase();
        const webpFilePath = imagePath.replace(ext, ".webp");

        try {
            // Convert image to WebP
            await sharp(imagePath).toFormat("webp").toFile(webpFilePath);

            console.log(`Converted: ${imagePath} -> ${webpFilePath}`);

            // Update references in HTML, CSS, and JS files
            const originalFileName = path.basename(imagePath);
            const webpFileName = path.basename(webpFilePath);

            updateReferences(originalFileName, webpFileName, ext);

            // Add fallback support for HTML
            if (htmlFiles.some((file) => fs.readFileSync(file, "utf-8").includes(originalFileName))) {
                addFallbackInHTML(originalFileName, webpFileName);
            }

        } catch (error) {
            console.error(`Error converting image: ${imagePath}`, error);
        }
    }

    console.log("Conversion and reference updates completed.");
}

// Update references in HTML, CSS, and JS files
function updateReferences(originalFileName, webpFileName, ext) {
    const allFiles = [...htmlFiles, ...cssFiles, ...jsFiles];

    allFiles.forEach((file) => {
        let content = fs.readFileSync(file, "utf-8");

        if (content.includes(originalFileName)) {
            const regex = new RegExp(originalFileName, "g");
            content = content.replace(regex, `${webpFileName}`);
            fs.writeFileSync(file, content, "utf-8");
            console.log(`Updated references in: ${file}`);
        }
    });
}

// Add fallback mechanism in HTML
function addFallbackInHTML(originalFileName, webpFileName) {
    htmlFiles.forEach((htmlFile) => {
        let content = fs.readFileSync(htmlFile, "utf-8");

        // Replace <img> tags with fallback support
        const imgRegex = new RegExp(`<img\\s+[^>]*src=["'](${originalFileName})["'][^>]*>`, "g");
        content = content.replace(imgRegex, (match, p1) => {
            return `
            <picture>
                <source srcset="${webpFileName}" type="image/webp">
                ${match}
            </picture>`;
        });

        fs.writeFileSync(htmlFile, content, "utf-8");
        console.log(`Added fallback in: ${htmlFile}`);
    });
}

// Start processing
convertImagesAndUpdate().catch((err) => console.error(err));
