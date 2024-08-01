// utils/fileUpload.js
const fs = require('fs');
const path = require('path');
const util = require('util');
const { pipeline } = require('stream');
const pump = util.promisify(pipeline);

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const saveFile = async (file) => {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+/, '');
  const fileExt = path.extname(file.filename);
  const fileName = `${timestamp}_${file.filename}`;
  const filePath = path.join(uploadDir, fileName);

  await pump(file.file, fs.createWriteStream(filePath));
  return fileName;
};

module.exports = { saveFile };