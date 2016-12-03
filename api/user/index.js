// var Bcrypt = require('bcrypt')
// var Boom = require('boom')
//
// var createNewJwt = require('../../utils/create-new-jwt')
// var verifyUniqueUser = require('./pre/verify-unique-user')
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