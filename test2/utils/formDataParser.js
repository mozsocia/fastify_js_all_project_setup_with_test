const fp = require('fastify-plugin')
const Busboy = require('@fastify/busboy')

async function uploadPlugin(fastify, options) {
  const {
    limits = {},
    fileFilter = () => true,
  } = options

  fastify.addContentTypeParser('multipart/form-data', (request, payload, done) => {
    done()
  })

  fastify.addHook('preHandler', async (request, reply) => {
    if (request.headers['content-type'] && request.headers['content-type'].startsWith('multipart/form-data')) {
      const busboy = new Busboy({ headers: request.headers, limits })
      const fields = {}
      const files = {}

      busboy.on('field', (fieldname, val) => {
        fields[fieldname] = val
      })

      const filePromises = []

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (!fileFilter(filename, mimetype)) {
          return file.resume()
        }

        const chunks = []
        const filePromise = new Promise((resolve, reject) => {
          file.on('data', (chunk) => chunks.push(chunk))
          file.on('end', () => {
            const fileBuffer = Buffer.concat(chunks)
            files[fieldname] = {
              filename,
              encoding,
              mimetype,
              buffer: fileBuffer
            }
            resolve()
          })
          file.on('error', reject)
        })
        filePromises.push(filePromise)
      })

      request.body = new Promise((resolve, reject) => {
        busboy.on('finish', async () => {
          try {
            await Promise.all(filePromises)
            resolve({ ...fields, files })
          } catch (err) {
            reject(err)
          }
        })
        busboy.on('error', reject)
        request.raw.pipe(busboy)
      })

      try {
        request.body = await request.body
      } catch (err) {
        console.error('File upload processing failed:', err)
        reply.code(400).send({ error: 'File upload processing failed' })
      }
    }
  })
}

module.exports = fp(uploadPlugin, {
  name: 'fastify-easy-multipart'
})