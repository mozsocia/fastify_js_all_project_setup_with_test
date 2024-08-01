// server.js
const fastify = require('fastify')({ logger: true });
const fs = require('fs');
const util = require('util');
const path = require('path');
const pipeline = util.promisify(require('stream').pipeline);

fastify.register(require('@fastify/multipart'));
fastify.register(require('@fastify/cors'), {
  origin: true // Allow all origins for this example. Adjust as needed.
});

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

fastify.post('/upload', async (request, reply) => {
  const parts = request.parts();

  let fields = {};
  let files = {
    image1: null,
    image2: null,
    fileAttachment: null
  };

  for await (const part of parts) {
    if (part.type === 'file') {
      files[part.fieldname] = part;
    } else {
      fields[part.fieldname] = part.value;
    }
  }

  const uploadedFiles = {};

  for (const [key, fileData] of Object.entries(files)) {
    if (fileData) {
      const fileName = path.join(uploadsDir, fileData.filename);
      await pipeline(fileData.file, fs.createWriteStream(fileName));
      uploadedFiles[key] = fileData.filename;
    }
  }

  const userInfo = {
    name: fields.name,
    age: fields.age,
    ...uploadedFiles
  };

  return { message: 'Data uploaded successfully', userInfo };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server is running on http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();