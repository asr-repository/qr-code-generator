// Pre-installed packages
import path from 'path';
import fs from 'fs';


// Manually installed packages
import qr from 'qr-image';
import inquirer from 'inquirer';
import sanitizeFilename from 'sanitize-filename';


// Name of the output folder
const outputFolder = 'QR Codes';


// Ensure the outputFolder exists, creating it if necessary
if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}


// Taking input using inquirer
inquirer
    .prompt([
        {
            type: 'input',
            name: 'URL',
            message: 'Enter the URL to generate a QR code for: ',
            validate: function (input) {
                const urlRegex = /^(https?:\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g;
                const isValidURL = urlRegex.test(input);
                return isValidURL || 'Please enter a valid URL (e.g. http://www.example.com): '
            },
        }
    ])
    .then(answers => {
        const url = answers.URL;

        // Remove http:// or https:// or www.
        const prefixCleanedURL = url.replace(/^https?:\/\/(www\.)?/, '');

        // Replace all '/' characters with hyphens, except the one at the end of URL, if any
        const cleanedURL = prefixCleanedURL.replace(/\/(?!$)/g, '-');

        // Sanitize the cleaned URL to remove invalid characters in a file name
        const sanitizedFileName = sanitizeFilename(cleanedURL);

        // Create output file path to use
        const outputFileName = `${sanitizedFileName}.png`;
        const outputPath = path.join(outputFolder, outputFileName);

        // Check if file already exists
        if (!fs.existsSync(outputPath)) {
            var qr_pnq = qr.image(url);
            qr_pnq.pipe(fs.createWriteStream(outputPath));
            console.log(`QR code image generated and saved to: ${outputPath}`);
        } else {
            console.log(`File already exists at: ${outputPath}`);
        }

    })
    .catch((error) => {
        if (error.isTtyError) {
            console.error('Prompt couldn\'t be rendered in the current environment');
        } else {
            console.log('Something else went wrong');
        }
    });