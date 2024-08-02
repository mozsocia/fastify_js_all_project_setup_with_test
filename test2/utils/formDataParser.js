const fp = require('fastify-plugin')
const Busboy = require('@fastify/busboy')

const defaultLimits = {
  fileSize: 1 * 1024 * 1024, // 1MB
  files: 10,
  fields: 10,
  parts: 11, // files + fields
};

async function uploadPlugin(fastify, options) {
  const {
    limits = defaultLimits,
    fileFilter = () => true,
  } = options

  fastify.addContentTypeParser('multipart/form-data', (request, payload, done) => {
    done()
  })

  fastify.addHook('preHandler', async (request,  ) => {
    if (request.headers['content-type'] && request.headers['content-type'].startsWith('multipart/form-data')) {
      const busboy = new Busboy({ 
        headers: request.headers, 
        limits: {
          ...defaultLimits,
          ...limits
        }
      })
      const fields = {}
      const files = {}

      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val
      })

      const filePromises = []
      let fileCount = 0

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        fileCount++
        if (fileCount > limits.files) {
          return file.resume()
        }

        if (!fileFilter(filename, mimetype)) {
          return file.resume()
        }

        const chunks = []
        const filePromise = new Promise((resolve, reject) => {
          file.on('limit', () => {
            reply.code(413).send({ error: `File size limit exceeded for ${fieldname}` })
            file.resume()
          })
          file.on('data', (chunk) => chunks.push(chunk))
          file.on('end', () => {
            if (!reply.sent) {
              const fileBuffer = Buffer.concat(chunks)
              files[fieldname] = {
                filename,
                encoding,
                mimetype,
                buffer: fileBuffer
              }
              resolve()
            }
          })
          file.on('error', reject)
        })
        filePromises.push(filePromise)
      })

      busboy.on('partsLimit', () => {
        reply.code(413).send({ error: 'Too many parts in the form data' })
      })

      busboy.on('fieldsLimit', () => {
        reply.code(413).send({ error: 'Too many fields in the form data' })
      })

      busboy.on('filesLimit', () => {
        reply.code(413).send({ error: 'Too many files in the form data' })
      })

      request.body = new Promise((resolve, reject) => {
        busboy.on('finish', async () => {
          if (!reply.sent) {
            try {
              await Promise.all(filePromises)
              resolve({ ...fields, files })
            } catch (err) {
              reject(err)
            }
          }
        })
        busboy.on('error', reject)
        request.raw.pipe(busboy)
      })

      try {
        request.body = await request.body
      } catch (err) {
        console.error('File upload processing failed:', err)
        if (!reply.sent) {
          reply.code(400).send({ error: 'File upload processing failed' })
        }
      }
    }
  })
}

module.exports = fp(uploadPlugin, {
  name: 'fastify-easy-multipart'
})