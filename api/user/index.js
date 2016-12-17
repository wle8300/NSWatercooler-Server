var OutfitBookmark = require('../../model/OutfitBookmark')
var User = require('../../model/User')

var Bcrypt = require('bcrypt')
var Boom = require('boom')
var Joi = require('joi')
var Errors = require('thinky')().Errors

module.exports = [
	{
		method: 'POST',
		path: '/user',
		config: {
			description: 'Create new User',
			tags: ['api'],
	    validate: {
	      payload: {
				  email: Joi.string().email().required(),
				  password: Joi.string().required(),
	      },
	    },
			pre: [{method: require('./pre/verify-unique-user')}]
		},
		handler: (request, reply) => {

		  Bcrypt.genSalt(10, (err, salt) => {
				
				if (err) {
					return reply(err)
				}
				
		    Bcrypt.hash(request.payload.password, salt, (err, hashedPassword) => {
    
				  if (err) {
	          return reply(err)
	        }
					
					User({
						email: request.payload.email,
						password: hashedPassword
					})
					.save()
					.then(reply)
					.catch(reply)
		    })
		  })
		}
	},
	{
		method: 'GET',
		path: '/user/{_User_}',
		config: {
			description: 'Get Yourself (the User)',
			tags: ['api'],
			auth: {strategy: 'jwt'},
	    validate: {
				params: {
					_User_: Joi.string().required()
				}
	    }
		},
		handler: function (request, reply) {

			if (request.params._User_ !== request.auth.credentials.id) return reply(Boom.unauthorized())

			User
			.get(request.params._User_)
			.then(reply)
			.catch(reply)
		}
	},
	{
		method: 'GET',
		path: '/user/{_User_}/outfit-bookmarks',
		config: {
			description: 'Get User\'s Outfit Bookmarks',
			tags: ['api'],
			auth: {strategy: 'jwt'},
	    validate: {
				params: {
					_User_: Joi.string().required()
				}
	    }
		},
		handler: function (request, reply) {
			
			if (request.params._User_ !== request.auth.credentials.id) return reply(Boom.unauthorized())
			
			OutfitBookmark
			.getAll(request.params._User_, {index: '_User_'})
			.then(reply)
			.catch(reply)
		}
	}
]