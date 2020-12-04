
const router = require("express").Router();

var UsersModel = require('../model/employée');



router.get('/',function(req,res){
  res.render("index.ejs")
});

router.get('/aj',function(req,res){
  res.render("ajouter.ejs")
});
router.post('/add', function (req, res, next) {
    console.log(req.body);
  
    const mybodydata = {
      idcart: req.body.idcart,
      nom: req.body.nom,
      prenom: req.body.prenom,
      email: req.body.email,
      adresse: req.body.adresse,
      telephone: req.body.telephone
    }
    var data = UsersModel(mybodydata); 
    //var data = UsersModel(req.body);
    data.save(function (err) {
      if (err) {
          console.log('errr')
      
      } else {
        
        console.log('ajouter Avec sucé')
        
    }
    })
  });
 
  router.get('/delete/:id', function(req, res) {
    UsersModel.findByIdAndRemove(req.params.id, function(err, project) {
        if (err) {
          console.log('problem')

            res.redirect('/gestionUtilisateur');
        } else {

           console.log('delete')
            res.redirect('/gestionUtilisateur');
        }
    });
});
router.get('/gestionUtilisateur', function(req, res) {
  UsersModel.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('gestionUtilisateur', { users: users });
      console.log(users);
    }
}); 

});
 /* GET SINGLE User BY ID */

router.get('/edit/:id', function(req, res) {
  console.log(req.params.id);
  UsersModel.findById(req.params.id, function (err, user) {
 
      res.render('UpdateForm.ejs', {user });
    
  });
});





  


router.get('/affichaHistorique', function(req, res) {
  UsersModel.find(function(err, users) {
    if (err) {
      console.log(err);
    } else {
      res.render('Gerer Historique.ejs', { users: users });
      console.log(users);
    }
}); 

});
router.get('/affichaHistorique',function(req,res){
  res.render('Gerer Historique.ejs')
  })
     
module.exports = router;