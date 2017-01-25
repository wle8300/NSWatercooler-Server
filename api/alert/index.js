const Dataservices = require('../../Dataservices')

const Joi = require('joi')

module.exports = [
	{
		method: 'GET',
		path: '/alert',
		config: {
			description: 'Get Alert',
			tags: ['api'],
			validate: {
				query: {
					server: Joi.string().required(),
					limit: Joi.number().default(10).required()
				}
			}
		},
		handler: (request, reply) => {

			/*
				There is only
				one alert at
				any given time
			*/
			
			Dataservices.dbg.getAlerts(request.query.server)
			.then((alerts) => reply(alerts.slice(0, request.query.limit)))
			.catch((err) => reply(Boom.badRequest(err)))
		}
	}
	
]