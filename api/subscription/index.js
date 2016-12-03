// var Boom = require('boom')
// var Joi = require('joi')
//
//
module.exports = [
	{
		method: 'GET',
		path: '/subscription',
		config: {
			tags: ['api'],
		},
		handler: (request, reply) => {
			reply('/GET subscription')
		}
	}
]