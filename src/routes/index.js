const express=require('express');
const router=express.Router();
const pool=require('../database');
const {isNotLoggedIn}=require('../lib/auth');


router.get('/',(req,res)=>{
res.render('principal/');
});

router.get('/vacantes',isNotLoggedIn,async (req,res)=>{
const lista= await pool.query("SELECT Id_Vacante,Titulo_Vacante, SUBSTRING(vacantes.Descripcion,1,100) AS descripcion,Img,Fecha_Inicio,Fecha_Final, vacantes.Fecha_Creacion, empresas.Nombre_Emp FROM vacantes INNER JOIN empresas WHERE empresas.Id_Empresas = vacantes.Id_Empresa;",);
//console.log(lista);
res.render('principal/vacantes',{lista});
});

router.get('/vervacante/:id', async(req,res)=>{
const {id}=req.params;
const vacante=await pool.query("SELECT * FROM vacantes WHERE Id_Vacante= ?",id);
//console.log(vacante[0]);
res.render('principal/vervacante',vacante[0]);
});

router.get('/servicios',async (req,res)=>{
const lista= await pool.query("SELECT Id_User,Nombres,ApellidoPa,ApellidoMa, SUBSTRING(Descripcion,1,100),Foto_Perfil,Especialidad FROM usuarios WHERE validar=0 ORDER BY Fecha_Creacion DESC");
//console.log(lista);
res.render('principal/servicios',{lista});
});

router.get('/somos',(req,res)=>{
res.render('principal/somos');
});

router.get('/verperfil/:id',async (req,res)=>{
    const {id}= req.params;
const usuario= await pool.query("SELECT * FROM usuarios WHERE Id_User=?",id);
const habilidades= await pool.query("SELECT Id_habi,Id_User,Titulo, SUBSTRING(descripcion,1,80) as descripcion,Fecha_Creacion,Img FROM habilidades WHERE Id_User=?",id);
const proyectos=await pool.query("SELECT Id_Proyecto,Id_User,Nombre_Proyecto,SUBSTRING(Descripcion,1,100) AS Descripcion,Img_Proyecto,Fecha_Creacion FROM proyectos WHERE Id_User=?",id);
res.render('principal/verperfil', {usu:usuario[0], habilidades,proyectos});
});

router.get('/verhabilidad/:id',async(req,res)=>{
    const {id}= req.params;
    const habilidad= await pool.query("SELECT * FROM habilidades WHERE Id_habi=?",id);
    //console.log(habilidad[0]);
    res.render("principal/verhabilidad",{habi: habilidad[0]});
});

router.get('/verproyecto/:id',async(req,res)=>{
    const {id}= req.params;
    const proyecto= await pool.query("SELECT * FROM proyectos WHERE Id_Proyecto=?",id);
    //console.log(proyecto[0]);
    res.render("principal/verproyecto",{proye: proyecto[0]});
});

module.exports=router;