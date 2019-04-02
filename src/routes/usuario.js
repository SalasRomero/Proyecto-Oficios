const express=require('express');
const router=express.Router();
const pool= require('../database');
const {isLoggedIn}=require('../lib/auth');
const fse=require('fs-extra');
const path=require('path');

router.get('/perfil', isLoggedIn,async(req,res)=>{
const {Id_User, validar}=req.user;
if(validar==1){
    res.redirect('validar');
}else{
    const habi= await pool.query("SELECT Id_habi,Id_User,Titulo, SUBSTRING(descripcion,1,80) as Descripcion,Fecha_Creacion,Img FROM habilidades WHERE Id_User=?",[Id_User]);
    const proye= await pool.query('SELECT Id_Proyecto,Nombre_Proyecto,SUBSTRING(Descripcion,1,80) as Descripcion,Img_Proyecto,Fecha_Creacion FROM proyectos WHERE Id_User=?',[Id_User]);
    const {Descripcion,Foto_Perfil,Especialidad}=req.user;
    res.render('usuario/perfil',{habi,proye});
}
});

router.get('/validar', isLoggedIn ,async(req,res)=>{
    res.render('usuario/validarperfil');
});

router.post('/validar', async(req,res)=>{
 const {trabajo, descripcion}=req.body;
 const objeto={
    Descripcion:descripcion,
    Especialidad:trabajo,
    validar: 0
 };
 const {Id_User}= req.user;
 //console.log(req.user);
 await pool.query('UPDATE usuarios set ? WHERE Id_User=?',[objeto,Id_User]);
 res.redirect('../usuario/perfil');
});

///Comienza lo de la pagina principal pero con el usuario

router.get('/vacantes',async (req,res)=>{
    const lista= await pool.query("SELECT Id_Vacante,Titulo_Vacante, SUBSTRING(vacantes.Descripcion,1,100) AS descripcion,Img,Fecha_Inicio,Fecha_Final, vacantes.Fecha_Creacion, empresas.Nombre_Emp FROM vacantes INNER JOIN empresas WHERE empresas.Id_Empresas = vacantes.Id_Empresa;");
    res.render('principal/vacantes',{lista});
    });
    
    router.get('/vervacante/:id', async(req,res)=>{
    const {id}=req.params;
    const vacante=await pool.query("SELECT * FROM vacantes WHERE Id_Vacante= ?",id);
   // console.log(vacante[0]);
    res.render('principal/vervacante',vacante[0]);
    });
    
    router.get('/servicios',async (req,res)=>{
        const {Id_User}= req.user;
    const lista= await pool.query("SELECT Id_User,Nombres,ApellidoPa,ApellidoMa, SUBSTRING(Descripcion,1,100),Foto_Perfil,Especialidad FROM usuarios WHERE validar=0 and Id_User <> ? ORDER BY Fecha_Creacion DESC",[Id_User]);
    //console.log(lista);
    res.render('principal/servicios',{lista});
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
       // console.log(proyecto[0]);
        res.render("principal/verproyecto",{proye: proyecto[0]});
    });

    
    router.get('/somos',(req,res)=>{
    res.render('principal/somos');
    });
    
    router.get('/verperfil/:id',async (req,res)=>{
        const {id}= req.params;
    const usuario= await pool.query("SELECT * FROM usuarios WHERE Id_User=?",id);
    const habilidades= await pool.query("SELECT Id_habi,Id_User,Titulo, SUBSTRING(descripcion,1,80) as descripcion,Fecha_Creacion,Img FROM habilidades WHERE Id_User=?",id);
    const proyectos=await pool.query("SELECT Id_Proyecto,Id_User,Nombre_Proyecto,SUBSTRING(Descripcion,1,100) AS Descripcion,Img_Proyecto,Fecha_Creacion FROM proyectos WHERE Id_User=?",id);
    const {Foto_Perfil} = usuario[0];
   // const {Img}= habilidades;
    //const {Img_Proyectos}= proyectos;
    //console.log(usuario[0]);
     usuario[0].Foto_Perfil= "../"+Foto_Perfil;
     const tamano= habilidades.length;
    // const tamanop= proyectos.length;
     //console.log(tamano);
    /* for(var i=0;i<tamano; i++){
       var {Img}= habilidades[i];
        habilidades[i].Img='../'+Img;
        console.log(habilidades[i].Img);
     }
     for(var i=0;i<tamanop; i++){
        var {Img_Proyecto}= proyectos[i];
        proyectos[i].Img_Proyecto='../'+Img_Proyecto;
         console.log(proyectos[i].Img_Proyecto);
      }*/
    //console.log(habilidades);
    res.render('usuario/verperfil', {usu:usuario[0], habilidades,proyectos});
    });

router.get('/EditarPerfil',(req,res)=>{
 res.render('usuario/EditarPerfil');
});

//Todavia hay que terminar lo del perfil
router.post('/EditarPerfil',async (req,res)=>{
const {nombre,apepa,apema,correo,telfono,trabajo,descripcion}=req.body;
const {Id_User}= req.user;
const objeto={
    Nombres:nombre,
    ApellidoPa:apepa,
    ApellidoMa:apema,
    Correo:correo,
    Telefono:telfono,
    Descripcion:descripcion,
    Especialidad:trabajo

}

await pool.query('UPDATE usuarios set ? WHERE Id_User=?',[objeto,Id_User]);
res.redirect('../../usuario/perfil');
});

//agregar las habilidades
router.get('/AgregarH',(req,res)=>{
 //console.log("Funcionando!!");
res.render('usuario/AgregarHabilidad');
});

router.post('/AgregarH', async(req,res)=>{
//console.log(req.body);
const {Id_User}=req.user;
const {titulo,descripcion,opcion}=req.body;
const objeto={
Id_User,
Titulo: titulo,
Descripcion:descripcion,
Img: opcion
};
await pool.query('INSERT INTO habilidades set ?',[objeto]);
res.redirect('../usuario/perfil');
});


router.get('/EditarHabi/:id',async(req,res)=>{
const {id}= req.params;
const resultado= await pool.query('SELECT * FROM habilidades WHERE Id_habi=?',[id]);
const habilidad=resultado[0];
res.render('usuario/EditarHabilidad',{habilidad});
});


router.post('/EditarHabi/:id',async(req,res)=>{
const {opcion,titulo,descripcion}=req.body;
const objeto={
    Titulo: titulo,
    Descripcion: descripcion,
    Img: opcion
};
const {id}=req.params;
await pool.query('UPDATE habilidades set ? WHERE Id_habi=?',[objeto,id]);
res.redirect('../../usuario/perfil');
});

router.get('/EliminarHabi/:id', async(req,res)=>{
const {id}=req.params;
await pool.query('DELETE FROM habilidades WHERE Id_habi=?',[id]);
res.redirect('../../usuario/perfil');
});

//Proyectos 

router.get('/AgregarP',(req,res)=>{
    //console.log("Funcionando!!");
   res.render('usuario/AgregarProyecto');
   });
   
   router.post('/AgregarP', async(req,res)=>{
   //console.log(req.body);
   const {Id_User}=req.user;
   const {titulo,descripcion,opcion}=req.body;
   const objeto={
   Id_User,
   Nombre_Proyecto: titulo,
   Descripcion:descripcion,
   Img_Proyecto: opcion
   };
   await pool.query('INSERT INTO proyectos set ?',[objeto]);
   res.redirect('../usuario/perfil');
   });
   


router.get('/EditarPro/:id',async(req,res)=>{
    const {id}= req.params;
    const resultado= await pool.query('SELECT * FROM proyectos WHERE Id_Proyecto=?',[id]);
    const proyecto=resultado[0];
    res.render('usuario/EditarProyecto',{proyecto});
    });
    
    
    router.post('/EditarPro/:id',async(req,res)=>{
    const {opcion,titulo,descripcion}=req.body;
    const objeto={
        Nombre_Proyecto: titulo,
        Descripcion: descripcion,
        Img_Proyecto: opcion
    };
    const {id}=req.params;
    await pool.query('UPDATE proyectos set ? WHERE Id_Proyecto=?',[objeto,id]);
    res.redirect('../../usuario/perfil');
    });
    
    router.get('/EliminarPro/:id', async(req,res)=>{
    const {id}=req.params;
    await pool.query('DELETE FROM proyectos WHERE Id_Proyecto=?',[id]);
    res.redirect('../../usuario/perfil');
    });
    
module.exports=router;