const { format } = require('timeago.js');

const herlper={};

herlper.timeago=(tiempo)=>{
return format(tiempo); 
}

herlper.fecha=(fecha)=>{
return format(new Date(fecha));
}

module.exports=herlper;
