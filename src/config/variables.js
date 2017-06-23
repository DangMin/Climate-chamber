const path = require('path')

const Config = {
  server: {
    host: 'localhost',
    port: 8080
  },
  good: {
    register: require('good'),
    options: { reporters: { console: [
      { module: 'good-squeeze', name: 'Squeeze', args: [{ response: '*', log: '*' }] },
      { module: 'good-console' },
      'stdout'
    ]}}
  },
  engines: (nj, base) => {
    return {
      engines: {
        html: {
          compile: (src, options) => {
            const template = nj.compile(src, options.environment)
            return context => template.render(context)
          },
          prepare: (options, next) => {
            const env = nj.configure(options.path, { watch: false })
            env.addGlobal('scriptFor', path => `public/js/${path}`)
            options.compileOptions.environment = env
            return next()
          }
        }
      },
      path: path.resolve(base, 'modules')
    }
  }

}

module.exports = Config
