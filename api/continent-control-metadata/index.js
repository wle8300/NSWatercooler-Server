var env = require('../../env')
var Dataservices = require('../../Dataservices')

// var Login = require('../../model/Login')
//
var Joi = require('joi')
// var Moment = require('moment')
// var R = require('thinky')(env.rdb).r


module.exports = [
	{
		method: 'GET',
		path: '/continent-control-metadata',
		config: {
			description: 'Get Planetside2 Login metrics',
			tags: ['api'],
			validate: {
				query: {
					server: Joi.string().required(),
					timeframe: Joi.string().valid(['now']).default('now').required()
				}
			}
		},
		handler: (request, reply) => {
			
			//not doing anything with "timeframe" yet
			
			Dataservices.fisu.getContinentControlMetadata(request.query.server)
			.then(reply)
			.catch(reply)
		}
	}
]