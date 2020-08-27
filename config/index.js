const mongoose = require('mongoose');

const MONGO_URI = 'mongodb+srv://Tirtharaj:pukai007@cluster0.t7zhe.mongodb.net/inventory?retryWrites=true&w=majority
 
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

