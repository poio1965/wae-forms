// node imports
const config = require('config');
// app imports
const utils = require('../utils/utils');

function genericRepository(mod) {

	var model = mod;

	// lean: return simple JS object instead of full mongoose object 
	function getAll(requestData, projection, forceGet, lean) {

		var params = requestData.params;

		if (config.get('showRepoLogs')) {
			console.log('Repo.getAll: %s with params: %s', model.modelName, JSON.stringify(params));
		}
		
		var relations = requestData ? requestData.get : '';

		if (forceGet) {
			if (relations === '') {
				relations = forceGet;
			} else {
				relations += ' ' + forceGet;
			}
		}
		var orderBy = requestData ? requestData.orderBy : { _id: 1 };

		return new Promise((resolve, reject) => {
			var query = model.find(params, projection).sort(orderBy).deepPopulate(relations);

			if (lean) {
				query = query.lean();
			}

			query.exec((err, results) => {
				if (err) {
					console.error('Repo.getAll.'+model.modelName+': %s', err.message);
					reject(new Error(err));
					return;
				}

				resolve(results);
				return;
			}).catch((error) => {
				reject(error);
			});
		});
	}

	function find(requestData, projection) {
		//console.log('find %s by id %s', model.modelName, id);
		var id = requestData.params.id;
		var relations = requestData ? requestData.get : '';
		return new Promise((resolve, reject) => {
			model.findById(id, projection).deepPopulate(relations).exec((err, result) => {
				if (err) {
					console.error('Repo.find.'+model.modelName+': %s', err.message);
					reject(new Error(err));
					return;
				}

				if (result) {
					resolve(result);
				} else {
					var message = 'Object ' + model.modelName + ' with id ' + id + ' not found';
					console.error('Repo.find: ' + message);
					reject({ type: 'notFound', message: message });
				}
			});
			return;
		});
	}

	function search(id, projection) {
		//console.log('find %s by id %s', model.modelName, id);

		//var relations = dataUtils.getData();
		return new Promise((resolve, reject) => {
			model.findById(id, projection).exec((err, result) => {
				if (err) {
					console.error('Repo.search.'+model.modelName+': %s', err.message);
					reject(new Error(err));
					return;
				}
				resolve(result);
			});
			return;
		});
	}

	function create(requestData, forceGet) {

		var modelToCreate = new model(requestData.params);
		if (config.get('showRepoLogs')) {
			console.log('Repo.create: ' + modelToCreate.constructor.modelName + ': ' + JSON.stringify(requestData.params));
		}
		var relations = requestData ? requestData.get : '';

		if (forceGet) {
			if (relations === '') {
				relations = forceGet;
			} else {
				relations += ' ' + forceGet;
			}
		}

		if ((typeof modelToCreate._id == 'undefined' || modelToCreate._id == null)
			&& typeof model.schema.paths._id !== 'undefined' && model.schema.paths._id.instance === 'String') {
			modelToCreate._id = utils.getNewObjectIdString();
			if (config.get('showRepoLogs')) {
				console.log('Repo.create: new id generated: ' + modelToCreate._id);
			}
		}
		return new Promise((resolve, reject) => {

			// set extra history data
			modelToCreate._user = requestData && requestData.user ? requestData.user : '-';
			modelToCreate._op = 'create';

			modelToCreate.save(function (err, result) {
				if (err) {
					console.error('Repo.create.'+model.modelName+': %s', err.message);
					reject(new Error(err));
					return;
				}
				// saveUpdateHistory(result, modelToCreate.collection.collectionName, 'create');
				resolve(result.deepPopulate(relations));
			});

			return;
		});
	}

	var update = function (id, requestData, toUpdate, retries, callback, nOnceFound) {
		if (config.get('showRepoLogs')) {
			console.log('Repo.update: %s id = %s with data: %s', model.modelName, id, JSON.stringify(toUpdate));
		}
		var relations = requestData ? requestData.get : '';

		if (typeof retries === 'undefined') {
			retries = 0;
		}

		return new Promise((resolve, reject) => {
			model.findOne({ _id: id }, model).then((o) => {

				if (!o) {
					reject(new Error('Object not found.'));
					return;
				}

				// copy data
				utils.extend(o, toUpdate);

				// set extra history data
				o._user = requestData && requestData.user ? requestData.user : '-';
				o._op = 'update';

				o.save(function (err, result, numberAffected) {
					if (err) {
						console.error('Repo.update.'+model.modelName+': %s', err.message);
						reject(new Error(err));
						return;
					}

					resolve(result.deepPopulate(relations));

				});
			});
			return;

		});
	};

	function remove(id, requestData) {
		return new Promise((resolve, reject) => {

			// 1. search
			model.findOne({ _id: id }, model).then((o) => {
				if (!o) {
					reject(new Error('Object not found.'));
					return;
				}

				// set extra history data
				o._user = requestData && requestData.user ? requestData.user : '-';
				o._op = 'remove';
				o.status = 9; // force change to create history

				// 2. update to save in history
				o.save(function (err, result) {
					if (err) {
						console.error('Repo.remove.'+model.modelName+': %s', err.message);
						reject(new Error(err));
						return;
					}

					// 3. remove
					o.remove(function (err, result) {
						if (err) {
							console.error('Repo.remove(2).'+model.modelName+': %s', err.message);
							reject(new Error(err));
							return;
						}

						if (result) {
							if (config.get('showRepoLogs')) {
								console.log('Repo.remove: Object ' + model.modelName + ' with id ' + id + ' was removed');
							}
							//saveUpdateHistory(result, model.collection.collectionName, 'remove');
							resolve(result);
						} else {
							var message = 'Object ' + model.modelName + ' with id ' + id + ' not found to be removed';
							console.error('Repo.remove: ' + message);
							reject({ type: 'notFound', message: message });
						}
					});
				});
			});
			return;
		});
	}

	function existsByParams(params) {
		return new Promise((resolve, reject) => {
			model.count(params, (err, count) => {
				if (err) {
					console.error('Repo.existsByParams.'+model.modelName+': %s', err.message);
					reject(new Error(err));
					return;
				}

				resolve(count > 0);
				return;
			}, (err) => {
				console.error('Repo.existsByParams(2).'+model.modelName+': %s', err.message);
				reject(new Error(err));
			});
		});
	}

	function findOne(params, relations, projection) {
		return new Promise((resolve, reject) => {
			model.findOne(params, projection).deepPopulate(relations).exec((err, o) => {
				if (err) {
					console.error('Repo.findOne:'+model.modelName+': %s', err.message);
					reject(new Error(err));
					return;
				}

				resolve(o);
				return;
			});
		});
	}

	function removeArrayMember(criteria) {
		return { $pull: criteria };
	}

	return {
		getAll: getAll,
		find: find,
		search: search,
		create: create,
		update: update,
		remove: remove,
		existsByParams: existsByParams,
		findOne: findOne,
		removeArrayMember: removeArrayMember
	};
}

module.exports = genericRepository;