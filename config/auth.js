module.exports = {
    ensureAuthenticated: function(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      req.flash('error_msg', 'Please log in to view that resource');
      res.redirect('/login');
    },
    forwardAuthenticated: function(req, res, next) {
      if (!req.isAuthenticated()) {
        return next();
      }
      res.redirect('/auth/products-view-only');      
    },
    isAuthorised : function(req,res,next) {
        if (req.isAuthenticated()) {
            console.log(req.user.role)
            if (req.user.role === 'Administrator' || req.user.role === 'Seller')
                next();
            else {
              req.flash('error_msg', 'only administrators are authorised to that resource');
              res.redirect('/auth/products-view-only');
            }
        }
        else{
        req.flash('error_msg', 'only administrators are authorised to that resource');
        res.redirect('/login');
      }    
    }
  };