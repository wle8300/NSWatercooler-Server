// var Bcrypt = require('bcrypt')
// var Boom = require('boom')
//
// var ../../utils/create-new-jwt = require('../../utils/create-new-jwt')
// var ./pre/verify-unique-user = require('./pre/verify-unique-user')
//
//
module.exports = [
	{
		method: 'GET',
		path: '/user',
		config: {
			tags: ['api'],
		},
		handler: (request, reply) => {
			reply('/GET user')
		}
	}
]