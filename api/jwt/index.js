module.exports = [
	{
		method: 'GET',
		path: '/jwt',
		config: {
			tags: ['api'],
		},
		handler: (request, reply) => {
			reply('/GET jwt')
		}
	}
]