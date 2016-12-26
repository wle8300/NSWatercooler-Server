// Example: http://ps4us.ps2.fisu.pw/outfit/?name=cp9x
// member login stats
// GET /login?timeframe=<day|week|month|year>&_Outfit_=<>

module.exports = [
	{
		method: 'GET',
		path: '/login',
		config: {
			description: 'baby',
			tags: ['api'],
		},
		handler: (request, reply) => {
			return reply('coo')
		}
	}
]