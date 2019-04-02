const express=require('express');
const router=express.Router();
const pool = require('../database');
const passport= require('passport');
const {isLoggedIn} =require('../lib/auth');


router.get('/login',(req,res)=>{
res.render('autenticacion/login');
});

router.post('/login',(req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '../usuario/perfil',
        failureRedirect: './login',
        failureFlash: true
    })(req,res,next)
});

router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('./login');
});

router.get('/crearcuenta',(req,res)=>{
res.render('autenticacion/crearcuenta');
});

router.post('/crearcuenta',passport.authenticate('local.signup',{
    successRedirect:'../../usuario/perfil',
    failureRedirect:'./crearcuenta',
    failureFlash: true
}));

router.get('/perfil',(req,res)=>{
res.render('../../usuario/perfil');
});


//Empresas

router.get('/loginempresa',(req,res)=>{
    res.render('autenticacion/loginempresa');
    });
    
    router.post('/loginempresa',(req,res,next)=>{
        passport.authenticate('local.signinempre',{
            successRedirect: '../empresa/perfil',
            failureRedirect: './login',
            failureFlash: true
        })(req,res,next)
    });

router.get('/crearempresa',(req,res)=>{
res.render('autenticacion/crearempresa');
});
    
router.post('/crearempresa',passport.authenticate('local.signupemp',{
    successRedirect:'../../empresa/perfil',
    failureRedirect:'./crearempresa',
    failureFlash: true
}));


module.exports=router;