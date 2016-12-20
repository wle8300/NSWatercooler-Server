var CharacterSubscription = require('../../model/CharacterSubscription')

var Boom = require('boom')
var Joi = require('joi')


module.exports = [
	{
		method: 'POST',
		path: '/character-subscription',
		config: {
			auth: {strategy: 'jwt'},
			tags: ['api'],
			validate: {
				payload: {
					_User_: Joi.string().required(),
					_Character_: Joi.string().required(),
					characterName: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			
			CharacterSubscription
			.getAll(request.auth.credentials.id, {index: '_User_'})
			.then((characterSubscription) => {
				
				var gotDuplicate = characterSubscription.filter((characterSubscription) => characterSubscription._Character_ === request.payload._Character_).length > 0 ? true : false
				
				if (gotDuplicate) return reply(Boom.conflict('Outfit bookmark already exists'))

				CharacterSubscription({
					_User_: request.auth.credentials.id, 
					_Character_: request.payload._Character_,
					characterName: request.payload.characterName
				})
				.save()
				.then(reply)
				.catch(reply)
			})
			.catch(reply)
		}
	},
	{
		method: 'DELETE',
		path: '/character-subscription/{_CharacterSubscription_}',
		config: {
			auth: {strategy: 'jwt'},
			tags: ['api'],
			validate: {
				params: {
					_CharacterSubscription_: Joi.string().required()
				}
			}
		},
		handler: function (request, reply) {
			
			CharacterSubscription
			.get(request.params._CharacterSubscription_)
			.then((characterSubscription) => {
				
				if (!characterSubscription) return reply(Boom.notFound('Outfit bookmark did not exist'))
				if (characterSubscription._User_ !== request.auth.credentials.id) return reply(Boom.unauthorized())
					
				characterSubscription
				.delete()
				.then(reply)
				.catch(reply)
			})
			.catch(reply)
		}
	}
]