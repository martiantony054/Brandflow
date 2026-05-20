const mongoose = require('mongoose')

const connect = process.env.connectionstring

mongoose.connect(connect).then(res=>{
    console.log("Brandflow server is connected to mongodb");
    
}).catch(err=>{
    console.log("OOPS THERE IS ERROR IN CONNECTING  " +err);
    
})