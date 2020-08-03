const mongoose = require('mongoose');

// DeprecationWarnings:
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

const uri = "mongodb://localhost/my_mongoose_db";
mongoose.connect( uri );
mongoose.Promise = global.Promise;

module.exports = mongoose;
