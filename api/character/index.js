var Dataservices = require('../../Dataservices')
var env = require('../../env')
var util = require('../../util')

var Joi = require('joi')
var Boom = require('boom')


module.exports = [
	{
		method: 'GET',
		path: '/character',
		config: {
			tags: ['api'],
			validate: {
				query: {
					search: Joi.string().required(),
					server: Joi.string().required(),
					limit: Joi.number().default(10)
				}
			}
		},
		handler: (request, reply) => {
			
			Dataservices.dbg.searchCharacters(request.query.server, request.query.search, request.query.limit)
			.then(reply)
			.catch((err) => {reply(Boom.badRequest(err))})
		}
	},
	{
		method: 'GET',
		path: '/character/{_Character_}',
		config: {
			tags: ['api'],
			validate: {
				params: {
					_Character_: Joi.string().required()
				},
				query: {
					server: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			
			Dataservices.dbg.getCharacterById(request.query.server, request.params._Character_)
			.then(reply)
			.catch((err) => {reply(Boom.badRequest(err))})
		}
	},
]