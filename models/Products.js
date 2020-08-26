const {Schema} = require('mongoose');
const mongoose = require('mongoose');

const ProductSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    productID: { 
        type : String,
        required : true
     },
    price : {
        type : String,
        required : true
    },
    sdesc : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    }
});

const Products = mongoose.model('Products',ProductSchema);
module.exports = Products;