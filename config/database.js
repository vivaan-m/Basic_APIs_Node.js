const mongo = require('mongoose');




const url =  process.env.DB_URl;


exports.connect =()=>{

    mongo.connect(url, {
        useNewUrlParser: true,
      useUnifiedTopology: true,
     
      }).then(()=>{
        console.log("connected with the database");
      }).catch((err)=>{
          console.log(err);
          console.log("Cannot connect with the database");
          process.exit(1);
      })




}