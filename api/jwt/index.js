const env = require('../../env')
const util = require('../../util')

const User = require('../../model/User')

const DeciferJwtPayload = require('jwt-decode')
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
			return reply({jwt: util.createNewJwt(request.pre.user)})
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

			User
			.get(DeciferJwtPayload(request.payload.jwt).id)
			.then((user) => reply({jwt: util.createNewJwt(user)}))
		}
	}
]