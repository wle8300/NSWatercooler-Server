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
					server: Joi.string().required(),
					page: Joi.number().default(1),
					limit: Joi.number().default(10)
				}
			}
		},
		handler: (request, reply) => {
			
			Dataservices.dbg.searchOutfits(request.query.server, request.query.search)
			.then((outfits) => reply(outfits))
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
			.then((outfit) => reply(outfit))
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
					filterOnlineCharacters: Joi.boolean().default(false)
				}
			}
		},
		handler: (request, reply) => {

			Dataservices.dbg.getOutfitMembers(request.query.server, request.params._Outfit_, request.query.filterOnlineCharacters)
			.then((outfitCharacters) => reply(outfitCharacters))
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
			
			/*
			> outfit adding "who's online RIGHT NOW" GET /outfit?search=•••&limit=•••&page=••• POST /outfit-subscription GET /user/•••/outfit-subscriptions GET/outfit/••• GET/character?outfit=•••&is-online=true
				
			*/
			/*
				IF 409, BOOM('DUPLICATE') {THE CLIENT SHOULD MANUALLY MAKE SUBSEQUENT GET REQUEST}
				IF 404, THEN SEARCH CENSUS.DBG {SIDE-EFFECT: GET CURRENT ONLINE MEMBERS}
				SIGN-UPS AND SESSIONS
				LET THEM SUBSCRIBE
				LAUNCH WEBSITE: list of indexed outfits, outfit pages, signups/login, subscribe to outfits, list of user's subscribed outfits,
				---memberries.com---
				iPHONE APP THAT HAS NOTIFICAIONS
			*/

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
						.then((outfit) => reply(outfit))
						.error((err) => reply(err))
				})
			})
			.error((err) => reply(err))
		}
	}
]