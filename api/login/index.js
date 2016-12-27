var env = require('../../env')

var Login = require('../../model/Login')

var Joi = require('joi')
var Moment = require('moment')
var R = require('thinky')(env.rdb).r
// Example: http://ps4us.ps2.fisu.pw/outfit/?name=cp9x
// member login stats
// GET /login?timeframe=<day|week|month>&_Outfit_=<>


module.exports = [
	{
		method: 'GET',
		path: '/login',
		config: {
			description: 'Get Planetside2 Login metrics',
			tags: ['api'],
			validate: {
				query: {
					_Outfit_: Joi.string(),
					timeframe: Joi.string().valid(['month', 'week', 'day', 'hour']).default('month')
				}
			}
		},
		handler: (request, reply) => {
			
			const _Outfit_ = request.query._Outfit_
			const rewind = new Date(Moment().subtract(1, request.query.timeframe))
			
			
			Login
			.between(
				[_Outfit_ ? _Outfit_ : R.minval, rewind],
				[_Outfit_ ? _Outfit_ : R.maxval, new Date()],
				{index: '_Outfit_Time'}
			)
			.orderBy({index: R.desc('_Outfit_Time')})
			.then(reply)
			.catch(reply)
		}
	}
]