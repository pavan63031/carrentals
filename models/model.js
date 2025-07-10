const mongoose = require('mongoose');


const carSchema = mongoose.Schema({
      id :{
        type : String,
        required : true,
        unique : true
      },
      name :{
        type : String,
        required : true
      },
      price :{
        type : Number,
        required : true
      },
      address :{
        type : String,
        required : true
      },
      seats :{
        type : Number,
        required : true
      },
      image : String,

});

module.exports = mongoose.model("Car",carSchema);





// const {getdb} = require('../utils/dbutil');


// class Car{
//     constructor(id,name,price,address,seats,image){
//         this.id = id;
//         this.name = name;
//         this.price = price;
//         this.address = address;
//         this.seats = seats;
//         this.image = image;
//     }

//     // save(){
//     //     carsarray.push(this);
//     // }

//     save() {
//       const db = getdb();
//       if(this.id) {
//         const updateFields = {
//           name : this.name,
//           price : this.price,
//           address : this.address,
//           seats : this.seats,
//           image : this.image
//         }
//         return db.collection("homes").updateOne({id : this.id},{$set : updateFields});
//       }
//       else{
//       return db.collection("homes").insertOne(this);
//       }
// }


//     static find(){
//       const db = getdb();
//       return db.collection("homes").find().toArray();
//     }
//      static findById(id) {
//       console.log(id);
//       const db = getdb();
//       return db.collection("homes").find({id : id}).next();
//   }
//   static deleteById(id) {
//      const db = getdb();
//       return db.collection("homes").deleteOne({id : id});
// }

// }

// module.exports = {Car};