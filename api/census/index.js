var Dataservices = require('../../Dataservices')

var Joi = require('joi')


module.exports = [
	{
		method: 'GET',
		path: '/census',
		config: {
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
			
			Dataservices.fisu.getCensus(request.query.server)
			.then(reply)
			.catch(reply)
		}
	},
]