const bcryp=require('bcryptjs');

const helpers={};

helpers.encryptPassword= async(password)=>{
  const salt=  await bcryp.genSalt(10);
  const hash=  await bcryp.hash(password,salt);
  return hash;
};

helpers.matchPassword= async (password, savedPassword)=>{
  try {
    return await  bcryp.compare(password,savedPassword);
  } catch (error) {
      console.error(error)
  }
};
module.exports=helpers;