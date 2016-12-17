var OutfitBookmark = require('../../model/OutfitBookmark')

var Boom = require('boom')
var Joi = require('joi')


module.exports = [
	{
		method: 'POST',
		path: '/outfit-bookmark',
		config: {
			auth: {strategy: 'jwt'},
			tags: ['api'],
			validate: {
				payload: {
					_Outfit_: Joi.string().required(),
					outfitAlias: Joi.string().required()
				}
			}
		},
		handler: (request, reply) => {
			
			OutfitBookmark
			.getAll(request.auth.credentials.id, {index: '_User_'})
			.then((outfitBookmarks) => {
				
				var gotDuplicate = outfitBookmarks.filter((outfitBookmark) => outfitBookmark._Outfit_ === request.payload._Outfit_).length > 0 ? true : false
				
				if (gotDuplicate) return reply(Boom.conflict('Outfit bookmark already exists'))

				OutfitBookmark({
					_User_: request.auth.credentials.id, 
					_Outfit_: request.payload._Outfit_,
					outfitAlias: request.payload.outfitAlias
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
		path: '/outfit-bookmark/{_OutfitBookmark_}',
		config: {
			auth: {strategy: 'jwt'},
			tags: ['api'],
			validate: {
				params: {
					_OutfitBookmark_: Joi.string().required()
				}
			}
		},
		handler: function (request, reply) {
			
			OutfitBookmark
			.get(request.params._OutfitBookmark_)
			.then((outfitBookmark) => {
				
				if (!outfitBookmark) return reply(Boom.notFound('Outfit bookmark did not exist'))
				if (outfitBookmark._User_ !== request.auth.credentials.id) return reply(Boom.unauthorized())
					
				outfitBookmark
				.delete()
				.then(reply)
				.catch(reply)
			})
			.catch(reply)
		}
	}
]