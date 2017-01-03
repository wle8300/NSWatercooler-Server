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
					limit: Joi.number().default(1).required()
				}
			}
		},
		handler: (request, reply) => {
						
			//RSS-TO-JSON parser: https://www.npmjs.com/package/rss-to-json
			
			/*
				There is only
				one alert at
				any given time
			*/
			
			Dataservices.fisu.getAlerts(request.query.server)
			.then((rssAlerts) => {
				
				const time = new Date(rssAlerts.items[0].created)
				const isActive = rssAlerts.items[0].title.match(/\[END\]/i) ? false : true
				const continent = (function() {
					
					if (rssAlerts.items[0].title.match(/Feeling the Heat/i)) return 'Indar'
					if (rssAlerts.items[0].title.match(/Marsh Madness/i)) return 'Hossin'
					if (rssAlerts.items[0].title.match(/Seeing Green/i)) return 'Amerish'
					if (rssAlerts.items[0].title.match(/Cold War/i)) return 'Esamir'
				})()

				return reply([{
					time: time,
					isActive: isActive,
					continent: continent
				}])
			})
			.catch(reply)
		}
	}
	
]