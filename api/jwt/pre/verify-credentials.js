var User = require('../../../model/User')

var Errors = require('thinky')().Errors
var Bcrypt = require('bcrypt')
var Boom = require('boom')


module.exports = function (request, reply) {
	
	User
	.getAll(request.payload.email, {index: 'email'})
	.then((users) => {
		
		if (!users.length) return reply(Boom.notFound('That user does not exist'))
		
		Bcrypt.compare(request.payload.password, users[0].password, (err, isValid) => {

			if (isValid) {
				return reply(users[0])
			}
			else {
				return reply(Boom.unauthorized('Please check your login credentials'))
			}
		})
	})
	.error(reply)
}