function prueba(){
    //alert("funciona");
var ajaxRequest= new XMLHttpRequest();
var contenedor=document.getElementById('contenedor');
//contenedor.innerHTML="<h1>Hola</h1>"
ajaxRequest.onreadystatechange=function(){
if(ajaxRequest.readyState == 4 && ajaxRequest.status == 200){
    contenedor.innerHTML=ajaxRequest.responseText;
}
}
ajaxRequest.open("GET",texto(),true);
ajaxRequest.send();
}
function texto(){
     var a={
        salas:"apellido",
        david:"Nombre"
    }
    return a;
}