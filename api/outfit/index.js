var Dataservices = require('../../Dataservices')
var env = require('../../env')
var util = require('../../util')

var Outfit = require('../../model/Outfit')

// var Async = require('async')
var Joi = require('joi')
var Boom = require('boom')
//
//
module.exports = [
	{
		method: 'GET',
		path: '/outfit',
		config: {
			tags: ['api'],
			validate: {
				query: {
					search: Joi.string().required(),
					server: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			
			Dataservices.dbg.searchOutfits(request.query.server, request.query.search)
			.then(reply)
			.catch((err) => {reply(Boom.badRequest(err))})
		}
	},
	{
		method: 'GET',
		path: '/outfit/{_Outfit_}',
		config: {
			tags: ['api'],
			validate: {
				params: {
					_Outfit_: Joi.string().required()
				},
				query: {
					server: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			
			Dataservices.dbg.getOutfitById(request.query.server, request.params._Outfit_)
			.then(reply)
			.catch((err) => {reply(Boom.badRequest(err))})
		}
	},
	{
		method: 'GET',
		path: '/outfit/{_Outfit_}/characters',
		config: {
			tags: ['api'],
			validate: {
				params: {
					_Outfit_: Joi.string().required()
				},
				query: {
					server: Joi.string().required(),
					filterOnline: Joi.string().default(false)
				}
			}
		},
		handler: (request, reply) => {
			Dataservices.dbg.getOutfitMembers(request.query.server, request.params._Outfit_, request.query.filterOnline)
			.then(reply)
			.catch((err) => {reply(Boom.badRequest(err))})
		}
	},
	{
		method: 'POST',
		path: '/outfit',
		config: {
			tags: ['api'],
			validate: {
				payload: {
					outfit: {
						region: Joi.string().valid('us', 'eu').required(),
						name: Joi.string().required()
					}
				}
			}
		},
		handler: (request, reply) => {
			
			Outfit
			.filter((doc) => doc('alias').match('^' +request.payload.outfit.name+ '$'))
			.then((outfits) => {
				
				if (outfits.length) return reply(Boom.conflict('Outfit already exists'))
				
				Dataservices.dbg.getOutfit(
					request.payload.outfit.region,
					request.payload.outfit.name,
					(err, response) => {
			
						if (response.body.outfit_list.length === 0) {
							return reply(Boom.notFound('Outfit doesn\'t exist.'))
						}
					
						Outfit(util.translateOutfitDBGModel(request.payload.outfit.region, response.body.outfit_list[0]))
						.save()
						.then(reply)
						.error(reply)
				})
			})
			.error((err) => reply(err))
		}
	}
]