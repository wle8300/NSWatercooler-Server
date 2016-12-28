var Login = require('../../model/Login')

var Dataservices = require('../../Dataservices')
var env = require('../../env')
var util = require('../../util')

var Moment = require('moment')
var Joi = require('joi')
var Boom = require('boom')
var R = require('thinky')(env.rdb).r


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
	{
		method: 'GET',
		path: '/character/{_Character_}/logins',
		config: {
			tags: ['api'],
			validate: {
				params: {
					_Character_: Joi.string().required()
				},
				query: {
					timeframe: Joi.string().valid(['month', 'week', 'day', 'hour']).default('month')
				}
			}
		},
		handler: (request, reply) => {
			
			const _Character_ = request.params._Character_
			const rewind = new Date(Moment().subtract(1, request.query.timeframe))
			
			
			Login
			.between(
				[_Character_ ? _Character_ : R.minval, rewind],
				[_Character_ ? _Character_ : R.maxval, new Date()],
				{index: '_Character_Time'}
			)
			.orderBy({index: R.desc('_Character_Time')})
			.then(reply)
			.catch(reply)
		}
	},
]