const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Products = require('../models/Products');
const bcrypt = require('bcryptjs');
const { forwardAuthenticated,ensureAuthenticated,isAuthorised } = require('../config/auth');
const passport = require('passport');

//access dashboard
router.get('/dashboard', isAuthorised, (req,res)=>{
    res.render('dashboard',{req});
});

//admin routes
router.get('/products', isAuthorised, (req,res)=>{
    if (req.user.role === 'Administrator'){
        Products.find()
        .then((products)=>{
            let errors = [];
            if (products.length!=0)
            {console.log(products);
            res.render('products', {products, req});
            }
            else{
                err.push({msg: 'No Products Found'});
                res.render('products',{
                    products,
                    errors,
                    req
                });
            }
        })
        .catch((err)=>{
            console.error(err);
        });
    }
    else if (req.user.role === 'Seller'){
        Products.find({productID : req.user._id}).lean()
        .then((products)=>{
            let errors = [];
            if (products.length!=0)
            {console.log(products);
            res.render('products', {products, req});
            }
            else{
                errors.push({msg: 'No Products Found'});
                res.render('products',{
                    products,
                    errors,
                    req
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    }
});


//add product
router.get('/addProduct', isAuthorised, (req,res)=>{
    res.render('addProduct',{req});
});
router.post('/addProduct',(req,res)=>{
    const {name, price, sdesc, description} = req.body;
    const productID = req.user._id;
    let errors = [];
    if (name==='' || price === '' || sdesc ==='' || description === '') errors.push({msg : 'please enter all the fields'});
    if (errors.length > 0){
        res.render('addProduct', {
            errors,
            name,
            price,
            sdesc,
            description,
            req
        });
    } else {
        const newProduct = new Products({
            name,
            productID,
            price,
            sdesc,
            description
        });
        newProduct.save()
        .then((product)=>{
            req.flash(
                'success_msg',
                'Product added!'
            );
            res.redirect('/auth/addProduct');
        })
        .catch((err)=>{
            console.error(err);
        });
    }

});


router.get('/delete/:delete_id', (req,res)=>{
    Products.findByIdAndDelete(req.params.delete_id)
    .then(()=>{
        req.flash(
            "success_msg",
            "product deleted"
        );
        res.redirect("/auth/products");
    })
    .catch((err)=>{
        console.log(err);
    })
});

router.get('/update/:update_id', (req,res)=>{
    Products.findOne({_id : req.params.update_id})
    .then((product)=>{
        const {_id,name, productID,price,sdesc,description} = product;
        res.render('updateProduct', {
            _id,
            name,
            productID,
            price,
            sdesc,
            description,
            req
        });
    })
    .catch((err) =>{
        throw err;
    })
});

router.post('/updateProductRoute/:_id', (req,res)=>{
    const {name,price,sdesc,description} = req.body;

    Products.findByIdAndUpdate(req.params._id,{
        name : name,
        productID : req.user._id,
        price : price,
        sdesc : sdesc,
        description : description
    })
    .then(()=>{
        req.flash(
            "success_msg",
            "product updated!"
        );
        res.redirect('/auth/products');
    })
});


//view only
router.get('/products-view-only', ensureAuthenticated ,(req,res)=>{
    Products.find()
    .then((products)=>{
        let errors = [];
            if (products.length!=0)
            {console.log(products);
            res.render('product-view-only', {products, req});
            }
            else{
                errors.push({msg: 'No Products Found'});
                res.render('product-view-only',{
                    products,
                    errors,
                    req
                });
            }
    })
    .catch((err)=>{
        console.error(err);
    });
});
module.exports = router;