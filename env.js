module.exports = {
	secret: 'imemba',
	supportEmail: {
		address: 'williamle8300@gmail.com',
		password: '!Elmailliw0',
	},
	rdb: {
		host: process.env.RETHINKDB_HOST || 'localhost',
		port: process.env.RETHINKDB_PORT || 28015,
    authKey: '',
		db: process.env.RETHINKDB_DB || 'memberberries_backend',
	},
	server: {
		protocol: process.env.SERVER_PROTOCOL || 'http',
		host: process.env.SERVER_HOST || '192.168.0.6',
		port: process.env.SERVER_PORT || '3001'
	},
	dbg: {
		serviceId: 'asdf'
	},
	supportEmail: {
		address: 'williamle8300@gmail.com',
		password: '!Elmailliw0',
	}
}