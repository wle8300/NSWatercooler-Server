var env = require('./env')
var package = require('./package');

var Glob = require('glob')
var Good = require('good')
var GoodConsole = require('good-console')
var Hapi = require('hapi')
var HapiJwt = require('hapi-auth-jwt')
var HapiSwagger = require('hapi-swagger');
var Inert = require('inert')
var Path = require('path')
var Vision = require('vision')

var server = new Hapi.Server()


server.connection({
	host: env.server.host,
	port: env.server.port,
	routes: {cors: true}
})

server.register([
	{
		register: Good,
		options: {
			reporters: [{
				reporter: GoodConsole,
				events: {
					response: '*',
					log: '*'
				}
			}]
		}
	},
	{register: HapiJwt},
	{register: Vision},
	{register: Inert},
	{
	  register: HapiSwagger,
	  options: 	{
	    info: {
	      title: package.name+ ' API v.' +package.version,
	      version: package.version,
	    },
			securityDefinitions: {
        jwt: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
        }
	    },
			security: [{'jwt': [] }]
	  }
  },
], function (err) {
		
	if (err) throw err
	
	server.auth.strategy('jwt', 'jwt', {
		key: env.secret,
		verifyOptions: {algorithms: ['HS256']}
	})
	
	server.route({
		path: '/',
		method: 'GET',
		handler: function (request, reply) {
			reply('Hello ' +package.name)
		}	
	})
	
	Glob.sync('api/**/index.js', {
	    root: __dirname
	}).forEach((file) => {
    server.route(require(Path.join(__dirname, file)))
  })
	
//	Database.init(function (err) {
//		
//		if (err) throw err
//
//		process.env.UV_THREADPOOL_SIZE = 64
//		
//		if (process.env.CRONNDIE === 'TRUE') {
//			cronRefreshRss.iterator()
//		}
//		
//		if (process.env.INVOICENDIE === 'TRUE') {
//			cronInvoice.iterator()
//		}
//		
//		else {
//
			server.start(function () {

				console.log('Server running at: ' +server.info.uri)

				// //start cron job
				// cronRefreshRss.job.start()
				// cronInvoice.job.start()
			})
//		}
//	})
})