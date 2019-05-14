if (!global._babelPolyfill) {
  require('@babel/polyfill')
}
const app = require('./app')

let server = app.listen(process.env.PORT, () => {
  console.log(`Started on port ${server.address().port}`)
})
