const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/test'
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

const ConnectDB = mongoose.connect(MONGO_URI, {
    useFindAndModify : false,
    useUnifiedTopology : true,
    useNewUrlParser : true
}).then(()=>{
    console.log('connected to mongoclient');
}).catch((err)=>{
    console.error(err);
});

module.exports = ConnectDB;

