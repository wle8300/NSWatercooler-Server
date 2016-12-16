const env = require('../../env')

const createNewJwt = require('../../util/create-new-jwt')

const Jwt = require('jsonwebtoken')
const Joi = require('joi')


module.exports = [
	{
		method: 'POST',
		path: '/jwt',
		config: {
			description: 'Create new JsonWebToken',
			tags: ['api'],
			validate: {
				payload: {
			    email: Joi.string().email().required(),
			    password: Joi.string().required()
				}
			},
			pre: [{method: require('./pre/verify-credentials.js'), assign: 'user'}]
		},
		handler: (request, reply) => {
			return reply({jwt: createNewJwt(request.pre.user)})
		}
	},
	{
		method: 'PUT',
		path: '/jwt',
		config: {
			description: 'Extend expiry for Your JsonWebToken',
			tags: ['api'],
			validate: {
				payload: {
					jwt: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			
			Jwt.verify(request.payload.jwt, env.secret, (err, payload) => {
				
				if (err) {
					return reply(err)
				}
				
				return reply({jwt: createNewJwt(payload)})
			})
		}
	}
]