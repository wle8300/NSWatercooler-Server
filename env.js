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
		db: process.env.RETHINKDB_DB || 'NSWatercooler',
	},
	server: {
		protocol: process.env.SERVER_PROTOCOL || 'http',
		host: process.env.SERVER_HOST || 'localhost',
		port: process.env.SERVER_PORT || '3003'
	},
	dbg: {
		serviceId: 'asdf'
	},
	supportEmail: {
		address: 'williamle8300@gmail.com',
		password: '!Elmailliw0',
	}
}