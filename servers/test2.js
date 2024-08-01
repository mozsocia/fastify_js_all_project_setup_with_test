const fp = require('fastify-plugin')
const multipart = require('@fastify/multipart')
const fastify = require('fastify')()


async function formDataParserP(fastify, options) {
  fastify.register(multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 1000000, // Max field value size in bytes
      fields: 10,         // Max number of non-file fields
      fileSize: 100000000, // For multipart forms, the max file size in bytes
      files: 10,          // Max number of file fields
      headerPairs: 2000   // Max number of header key=>value pairs
    }
  })

  fastify.addHook('preHandler', async (request, reply) => {
    const contentType = request.headers['content-type'] || ''
    
    if (contentType.includes('multipart/form-data')) {
      const data = await request.file()
      request.body = {}
      request.body.files = {}

      for await (const part of data) {
        if (part.file) {
          request.body.files[part.fieldname] = {
            filename: part.filename,
            mimetype: part.mimetype,
            file: part.file
          }
        } else {
          request.body[part.fieldname] = part.value
        }
      }
    }
    // If it's not multipart/form-data, Fastify will parse JSON automatically
  })
}





const formDataParser = fp(formDataParserP, {
  name: 'formDataParser'
})

fastify.register(formDataParser)

fastify.post('/upload', async (request, reply) => {
  if (request.body.files) {
    // Handle multipart form data
    console.log('Fields:', request.body)
    console.log('Files:', request.body.files)
  } else {
    // Handle JSON data
    console.log('JSON data:', request.body)
  }
  
  return { status: 'success' }
})

fastify.listen(3000, (err) => {
  if (err) throw err
  console.log('Server listening on http://localhost:3000')
})