var User = require('../../model/User')

var Bcrypt = require('bcrypt')
var Boom = require('boom')
var Joi = require('joi')


module.exports = [
	{
		method: 'POST',
		path: '/user',
		config: {
			description: 'Create new User',
			tags: ['api'],
	    validate: {
	      payload: {
	      	user: Joi.object().keys({
					  email: Joi.string().email().required(),
					  password: Joi.string().required(),
	      	}).required()
	      },
	    },
			pre: [{method: require('./pre/verify-unique-user')}]
		},
		handler: (request, reply) => {
    
		  Bcrypt.genSalt(10, (err, salt) => {
				
				if (err) {
					return reply(err)
				}
				
		    Bcrypt.hash(request.payload.user.password, salt, (err, hashedPassword) => {
    
				  if (err) {
	          return reply(err)
	        }
					
					User({
						email: request.payload.user.email,
						password: hashedPassword
					})
					.save()
					.then((user) => reply(user))
					.catch((err) => reply(err))
		    })
		  })
		}
	}]