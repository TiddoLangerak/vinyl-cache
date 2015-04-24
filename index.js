var through = require('through2');
var combine = require('stream-combiner2');
var crypto = require('crypto');
var caches = {};

module.exports = function (transform, key) {
	key = key || "default";
	caches[key] = caches[key] || {};
	var cache = caches[key];
	var fromCache = [];

	//We need to save the hashes per file because we can't calculate them in the second transformer
	var hashes = {};
	return combine(
		through.obj(function(chunk, enc, done) {
			var hash = crypto.createHash('md5').update(chunk.path).update(chunk.contents).digest('hex');
			hashes[chunk.path] = hash;
			if (cache[hash]) {
				fromCache.push(cache[hash]);
				done(null, null);
			} else {
				done(null, chunk);
			}
		}),
		transform,
		through.obj(function(chunk, enc, done) {
			var hash = hashes[chunk.path];
			cache[hash] = chunk;
			done(null, chunk);
		}, function(cb) {
			var self = this;
			fromCache.forEach(function(chunk) {
				self.push(chunk);
			});
			cb();
		})
	);
};
