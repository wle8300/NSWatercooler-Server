var User = require('../../../model/User')

var Boom = require('boom')


module.exports = (request, reply) => {
	
	User
	.getAll(request.payload.user.email, {index: 'email'})
	.then((users) => {

		if (users.length) return reply(Boom.conflict('User already exists'))
		
		return reply()
	})
	.catch((err) => {reply(err)})
}
