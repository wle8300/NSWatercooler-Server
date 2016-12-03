module.exports = {
	secret: 'imemba',
	server: {
		protocol: process.env.SERVER_PROTOCOL || 'http',
		host: process.env.SERVER_HOST || 'localhost',
		port: process.env.SERVER_PORT || '3001',
	},
	supportEmail: {
		address: 'williamle8300@gmail.com',
		password: '!Elmailliw0',
	}
}