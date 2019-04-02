//declaracion
const express= require('express');
const app=express();
const exhbs= require('express-handlebars');
const path =require('path');
const MySQLStore=require('express-mysql-session');
const flash=require('connect-flash');
const session= require('express-session');
const passport=require('passport');

const {database}=require('./keys');
require('./lib/passport');
//setting
app.set('port',process.env.PORT || 3000 );
app.set('views',path.join(__dirname,'views'));
app.engine('.hbs',exhbs({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars') 
}));


app.set('view engine', '.hbs');
//midleware
app.use(session({
    secret:'On-fficios',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


app.use((req,res,next)=>{
    app.locals.success=req.flash('success');
    app.locals.error=req.flash('error');
    app.locals.error=req.flash('warning');
    app.locals.user = req.user;
    next();
});

//variable globales

//rutas
app.use(require('./routes'));
app.use('/usuario',require('./routes/usuario'));
app.use('/autenticacion',require('./routes/autenticacion'));
//app.use('principal',require('./routes/index'));
//publicos

app.use(express.static(path.join(__dirname,'public')));

//servidor
app.listen(app.get('port'),(err)=>{
    if(err){
        console.error('Ocurrio un erro: ',err);
    }else{
        console.log("Servidor funcionando en el puerto: ",app.get('port'));
    }
});