const passport= require('passport');
const LocalStrategy =require('passport-local').Strategy;
const pool= require('../database');
const helpers= require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
}, async(req,username,password,done)=>{
 const usuario= await pool.query('SELECT * FROM usuarios WHERE Correo= ?',[username]);
   // console.log(usuario);   
 if(usuario.length > 0 ){
        const user=usuario[0];
        const validar= await helpers.matchPassword(password,user.Contrasena);
        //console.log(user);
        if(validar){
            //console.log(user);
            if(user.Tipo==1){
                user.Tipo=true;
            }else{
                user.Tipo=false;               
            }
            console.log(user);
            done(null,user,req.flash('success','Bienvenido a On-fficios: '+user.Nombres));
        }else{
            done(null,false,req.flash('error','La contraseña es incorrectas'));
        }
    }else{
       return done(null,false,req.flash('error','Error el usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'correo',
    passwordField: 'password',
    passReqToCallback: true
},async(req,username,password,done)=>{
    //console.log(req.body);
    const {nombre, apepa,apema,telefono,sexo}=req.body;
    const usuario={
        Nombres: nombre,
        ApellidoPa: apepa,
        ApellidoMA: apema,
        Correo: username,
        Contrasena: password,
        Telefono: telefono,
        Tipo:sexo
    }
//console.log(usuario);
 usuario.Contrasena= await helpers.encryptPassword(password);
 //onsole.log(usuario);
 const resultado=await pool.query("INSERT INTO usuarios set ?",[usuario]);
 //console.log(resultado);
 usuario.Id_User=resultado.insertId;
 console.log('usuario');
 done(null,usuario);
}));

passport.serializeUser((user,done)=>{
    done(null,user.Id_User);
});

passport.deserializeUser(async(id,done)=>{
    const rows=await pool.query('SELECT * FROM usuarios WHERE Id_User=?',id);
    done(null, rows[0]);
});