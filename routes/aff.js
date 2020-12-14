
const router = require("express").Router();

var morgan = require("morgan");

var UsersModel = require('../model/employée');
const bodyParser = require("body-parser");

const session = require('express-session');
var teacherModel = require('../model/user');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;


const urlencodeParser = bodyParser.urlencoded({ extended :false})
router.get('/',function(req,res){
  res.render("index.ejs")
});

 
router.get('/aj',function(req,res){
  res.render("ajouter.ejs")
});

router.post('/add',urlencodeParser, 
 function (req, res, next) {
   
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
    data.save(function (err,red) {
      if(err){
        res.render('ajouter', { errorMsg : 'problem essaie une autre fois' });
       }else{
        res.render('ajouter', { message: 'ADD successfully!'});
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
  UsersModel.findById(req.params.id, function (err, user) {
    if (err) {
      console.log(err);
    } else {
      res.render('UpdateForm', { user });
    }
  });
});




router.post('/edit/:id', function(req, res) {
  UsersModel.findByIdAndUpdate(req.params.id, req.body, function (err) {
    if(err){
      //req.flash('error_msg', 'Something went wrong! User could not updated.');
      res.redirect('/');
  } else {
   // req.flash('success_msg', 'Record Updated');
    res.redirect('/gestionUtilisateur');
  }
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
     


 

  router.get('/login', function(req, res, next) {
    
     res.render('login');
    //res.redirect('/');
    
  });

 
  




 router.post('/login', (req, res, next) => {
	//console.log(req.body);
	teacherModel.findOne({ email: req.body.email }, (err, data) => {
		if (data) {

			if (data.password == req.body.password) {
				//console.log("Done Login");
				req.session.user_sid = data.unique_id;
				//console.log(req.session.userId);
        //res.send({ "Success": "Success!" });
        res.redirect('/');


			} else {
        //res.send({ "Success": "Wrong password!" });
        res.render('login', { errorMsg: 'Wrong password!'});

        
			}
		} else {
      res.render('login', { errorMsg: 'This Email Is not regestered!'});

		//	res.send({ "Success": "This Email Is not regestered!" });
		}
	});
});

 
  /*
  router.post('/', function(req, res, next) {
    teacherModel.findOne({email:req.body.email}).exec().then(result=>{
      if(bcryptjs.compareSync(req.body.password,result.password)){
       req.session.cust_log = "true"; 
         req.session.email = result.email; 
       res.redirect('/');
       }
     else{
         res.status(201).json({"error":"Wrong Password"}); 
     }	
    }).catch(err=>{
      res.status(500).json({"error":"Wrong Password"});
    });
   
   });
   */
 
  

  router.get('/forgetpass', (req, res, next) => {
    res.render("forget.ejs");
  });
  router.post('/forgetpass', (req, res, next) => {
    //console.log('req.body');
    //console.log(req.body);
    teacherModel.findOne({ email: req.body.email }, (err, data) => {
      console.log(data);
      if (!data) {
        res.render('forget', { message: 'This Email Is not regestered'});

        //res.send({ "Success": "This Email Is not regestered!" });
      } else {
        // res.send({"Success":"Success!"});
        if (req.body.password == req.body.passwordConf) {
          data.password = req.body.password;
          data.passwordConf = req.body.passwordConf;
  
          data.save((err, Person) => {
            if (err)
              console.log(err);
            else
              console.log('Success');
            res.render('forget', { message: 'Password changed!'});
            //res.render('login', { message: 'Password changed!'});

          });
        } else {
          res.render('forget', { errorMsg : 'Password does not matched! Both Password should be same.' });
        }
      }
    });
  
  });
  
  router.get('/registre',function(req,res){
    res.render("registerr.ejs")
  });

  router.post('/regis', (req, res, next) => {
    console.log(req.body);
    var personInfo = req.body;
  
  
    if (!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf) {
      res.send();
    } else {
      if (personInfo.password == personInfo.passwordConf) {
  
        teacherModel.findOne({ email: personInfo.email }, (err, data) => {
          if (!data) {
            var c;
            teacherModel.findOne({}, (err, data) => {
  
              if (data) {
                console.log("if");
                c = data.unique_id + 1;
              } else {
                c = 1;
              }
  
              var newPerson = new teacherModel({
                unique_id: c,
                email: personInfo.email,
                username: personInfo.username,
                password: personInfo.password,
                passwordConf: personInfo.passwordConf
              });
  
              newPerson.save((err, Person) => {
                if (err)
                  console.log(err);
                else
                  console.log('Success');
              });
  
            }).sort({ _id: -1 }).limit(1);
            //res.send({ "Success": "You are regestered,You can login now." });
            res.render('registerr', { message: 'You are regestered,You can login now.'});

          } else {
           // res.send({ "Success": "Email is already used." });
            res.render('registerr', { errorMsg: 'Email is already used'});

          }
  
        });
      } else {
        res.render('registerr', { errorMsg: 'password is not matched'});

        //res.send({ "Success": "password is not matched" });
      }
    }
  });
  
  
  

module.exports = router;