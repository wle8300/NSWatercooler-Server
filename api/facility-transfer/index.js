var env = require('../../env')
var FacilityTransfer = require('../../model/FacilityTransfer')

var Joi = require('joi')
var Moment = require('moment')
var R = require('thinky')(env.rdb).r


module.exports = [
	{
		method: 'GET',
		path: '/facility-transfer',
		config: {
			description: 'Get Facility Transfer events',
			tags: ['api'],
			validate: {
				query: {
					server: Joi.string().required(),
					timeframe: Joi.string().valid(['month', 'week', 'day', 'hour']).default('week')
				}
			}
		},
		handler: (request, reply) => {
						
			const rewind = new Date(Moment().subtract(1, request.query.timeframe))
			
			FacilityTransfer
			.between([request.query.server, rewind], [request.query.server, new Date()], {index: 'world_time'})
			.orderBy({index: R.desc('world_time')}) //newer=>older
			.then((x) => {
				console.log(x);
				return reply(x)
			})
			.catch(reply)
		}
	}
]