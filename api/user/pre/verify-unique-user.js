var Boom = require('boom')
var R = require('rethinkdb')

var Database = require('../../../database')

module.exports = (request, reply) => {
	
	Database.connect((err, connection) => {
		
		if (err) {
			connection.close()
			return reply(err)
		}
		
		R.table('user')
		.getAll(request.payload.user.username, {index: 'username'})
	  .union(
			R.table('user').getAll(request.payload.user.email, {index: 'email'})
		)
		.distinct()
		.run(connection, (err, result) => {
			
			var preExistingUser = result.length ? result[0] : null
						
			if (err) {
				connection.close()
				return reply(err)
			}

	    if (preExistingUser) {
	      if (preExistingUser.username === request.payload.user.username) {
					connection.close()
					return reply(Boom.badRequest('Username taken'))
	      }
	      if (preExistingUser.email === request.payload.user.email) {
					connection.close()
	        return reply(Boom.badRequest('Email taken'))
	      }
	    }
			
			connection.close()
	    return reply(request.payload)
		})
	})
}
