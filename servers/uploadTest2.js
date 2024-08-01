const fastify = require('fastify')()
const cors = require('@fastify/cors')
const formDataParser = require('./formDataParser')

fastify.register(cors, {
  origin: '*' // or the URL where your React app is running
})

fastify.register(formDataParser)

fastify.post('/upload', async (request, reply) => {
  if (request.body.files) {
    // Handle multipart form data
    console.log('Fields:', request.body)
    // console.log('Files:', request.body.files)
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