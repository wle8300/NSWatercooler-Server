const Jwt = require('jsonwebtoken')
const env = require('../env')


module.exports = function (payload) {
	
	delete payload.exp
	delete payload.iat
	
	return Jwt.sign(		
		payload,
		env.secret,
		{
	  	algorithm: 'HS256',
	  	expiresIn: "21d"
	  }
	)
}
