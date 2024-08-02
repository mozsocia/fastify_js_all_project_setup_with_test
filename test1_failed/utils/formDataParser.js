const fp = require('fastify-plugin')
const Busboy = require('@fastify/busboy')
const util = require('util')
const fs = require('fs')
const path = require('path')
const os = require('os')

const pipeline = util.promisify(require('stream').pipeline)

async function uploadPlugin(fastify, options) {
  const {
    limits = {},
    fileFilter = () => true,
    tempDir = os.tmpdir(),
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

      busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if (!fileFilter(filename, mimetype)) {
          return file.resume()
        }

        const saveTo = path.join(tempDir, `${Date.now()}-${filename}`)
        files[fieldname] = {
          filename,
          encoding,
          mimetype,
          file,
          path: saveTo
        }
        pipeline(file, fs.createWriteStream(saveTo))
      })

      request.body = new Promise((resolve, reject) => {
        busboy.on('finish', () => {
          resolve({ ...fields, files })
        })
        busboy.on('error', reject)
        request.raw.pipe(busboy)
      })

      try {
        request.body = await request.body
      } catch (err) {
        reply.code(400).send({ error: 'File upload failed' })
      }
    }
  })
}

module.exports = fp(uploadPlugin, {
  name: 'fastify-easy-multipart'
})