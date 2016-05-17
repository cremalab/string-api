/**
 * This script automatically creates a default Admin user when an
 * empty database is used for the first time. You can use this
 * technique to insert data into any List you have defined.
 *
 * Alternatively, you can export a custom function for the update:
 * module.exports = function(done) { ... }
 */



// This is the long-hand version of the functionality above:

var keystone = require('keystone'),
	async = require('async'),
	User = keystone.list('Location');

function copyGoogleData(location, done) {
  location.getDetails().then( (data) => {
    console.log(`info saved for ${data.name} from update`);
    done(err);
	});

}

exports = module.exports = function(done) {
  keystone.list('Location').model.where({'info.geo': null}).exec((err, results) => {
    async.forEach(results, copyGoogleData, done)
  })
};
