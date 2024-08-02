// fileUtils.js
const fs = require('fs').promises
const path = require('path')

const UPLOAD_DIR = path.join(__dirname, '..' , 'uploads')

async function ensureUploadDir() {
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
}

async function saveFile(file, prefix = '') {
  await ensureUploadDir()
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '_')
  const fileName = `${prefix}${timestamp}_${file.filename}`
  const filePath = path.join(UPLOAD_DIR, fileName)
  await fs.writeFile(filePath, file.buffer)
  return fileName
}

module.exports = { saveFile }