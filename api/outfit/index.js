// var env = require('../../env')
//
// var Async = require('async')
// var Joi = require('joi')
//
//
module.exports = [
	{
		method: 'GET',
		path: '/outfit',
		config: {
			tags: ['api'],
		},
		handler: (request, reply) => {
			reply('/GET oufit')
		}
	}
]