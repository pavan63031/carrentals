const {check,validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

let favourites = [];
const Car = require('../models/model');
const User = require('../models/user');

exports.home = (req,res) => {
    res.render('home',{
      isLoggedIn : req.isLoggedIn,
      user : req.session.user
    });
}

exports.addcar = (req,res) => {
    res.render('addcar',{editing : false,isLoggedIn : req.isLoggedIn,user : req.session.user});
}

exports.showcarsadded = (req,res) => {
    const id = Math.random()*1000;
    const {name,price,address,seats} = req.body;
     if(!req.file){
      res.status(422).send("Not An Image");
    }
    const image = req.file.path;
    const car = new Car({id,name,price,address,seats,image});


    car.save().then(() =>{ console.log("succesfully saved")
  console.log(name,price,address,image,seats);})
    Car.find().then((response) => {
      res.render('showcarshost',{carsarray : response,isLoggedIn : req.isLoggedIn,
        user : req.session.user
      });
    });
}

exports.showusercars = (req,res) => {
     Car.find().then((response) => {
      res.render('showcarsuser',{carsarray:response,isLoggedIn : req.isLoggedIn,user : req.session.user});
    });
}

exports.showhostcars = (req,res) => {
     Car.find().then((response) => {
      res.render('showcarshost',{carsarray : response,isLoggedIn : req.isLoggedIn,user : req.session.user});
    });
}



exports.getfavourites = (req, res) => {
  const id = Number(req.params.id);
  // const car = carsarray.find((car) => car.id === id);
  Car.findOne({id : id}).then((car) => {
    const alreadyexists = favourites.some((fav) => fav.id === car.id);
    if(!alreadyexists){
     favourites.push(car);  
    }
 res.redirect('/favourites',{isLoggedIn : req.isLoggedIn});
  });
  
};

exports.getdetails = (req, res) => {
   const id = Number(req.params.id);

  Car.findById(id).then(car => {
    if(!car) {
      res.redirect('/');
    }
    else{
      res.render('details', { car,isLoggedIn : req.isLoggedIn ,user : req.session.user});
    }
  })
};


exports.showFavourites = (req, res) => {
  res.render('favourites', { favourites,isLoggedIn : req.isLoggedIn,user : req.session.user });
};


exports.deletecar = (req, res) => {
  const id = Number(req.params.id);
Car.findOneAndDelete({id : id}).then((response) => {
  res.redirect('/hostcars'); 
})
};

// exports.deletefav = (req,res) => {
//   const id = Number(req.params.id);
//   favourites = favourites.filter((car) => String(car.id) !== id);
//   console.log(favourites);
//   res.redirect('/favourites');
// }

exports.deletefav = (req,res) => {
  const id = req.params.id; // treating id as string

  favourites = favourites.filter((car) => String(car.id) !== id);

  console.log("Updated favourites:", favourites);

  res.redirect('/favourites',{isLoggedIn : req.isLoggedIn});
};


exports.editcar = (req,res) => {
   const id = Number(req.params.id);
   const editing = req.query.editing;
  Car.findOne({id : id}).then((car) => {
    res.render('addcar',{editing : editing,car : car,isLoggedIn : req.isLoggedIn,user : req.session.user});
  })
}



// exports.editcarz = (req, res) => {
//   const id = Number(req.body.id); // your custom user-defined ID
//   const { name, price, address,seats } = req.body;
//   if(req.file){
//      const image = req.file.path;
//   }

//   Car.findOneAndUpdate(
//     { id: id }, // filter by custom id
//     { name, price, address, seats }, // fields to update
//     { new: true } // return the updated document
//   )
//     .then(() => {
//       res.redirect('/hostcars');
//     })
//     .catch((err) => {
//       console.error("Error updating car:", err);
//       res.redirect('/');
//     });
// };

exports.editcarz = (req, res) => {
  const id = Number(req.body.id); // custom user-defined ID
  const { name, price, address, seats } = req.body;

  Car.findOne({ id: id })
    .then((car) => {
      if (!car) {
        return res.status(404).send("Car not found");
      }

      const updateData = {
        name,
        price,
        address,
        seats
      };

      // If a new image is uploaded, update it
      if (req.file) {
        updateData.image = req.file.filename; // only filename saved
      }

      return Car.findOneAndUpdate({ id: id }, updateData, { new: true });
    })
    .then(() => {
      res.redirect('/hostcars');
    })
    .catch((err) => {
      console.error("Error updating car:", err);
      res.redirect('/');
    });
};

exports.getLogin = (req,res) => {
  res.render('login',{
    isLoggedIn : false,
  errors : [],
oldInput : {email : ""},
user : {}
});
}

exports.postLogin = async (req,res) => {
  // req.body.isLoggedIn = true;
  console.log(req.body);
  const {email,password} = req.body;

  const user = await User.findOne({email : email})

  if(!user){
     return res.status(422).render('login',{
        isLoggedIn : false,
        errors : ["invalid email"],
        oldInput : {email},
        user : {}
      });
  }

  const isMatch = await bcrypt.compare(password,user.password);

  if(!isMatch){
    return res.status(422).render('login',{
        isLoggedIn : false,
        errors : ["invalid password"],
        user : {}
      });
  }

  // res.cookie("isLoggedIn",true);
  req.session.isLoggedIn = true;
  req.session.user = user;
  await req.session.save();
  // res.setHeader('Set-Cookie', 'isLoggedIn=true');
  res.redirect('/');
}
exports.postLogout = (req, res) => {
  // res.cookie("isLoggedIn",false);
  req.session.destroy(() => {
    res.redirect('/login');
  })
};

exports.getSignup = (req,res) => {
  res.render('signup',{
    isLoggedIn : false,
    errors : [],
    oldInput : {
       firstname : "",
          lastname : "",
          email : "",
          password : "",
          accountType : ""
    },
    user : {}

  });
}

exports.postSignup = [
  check('firstname')
  .notEmpty()
  .withMessage("First Name Is Required")
  .trim()
  .isLength({min : 2})
  .withMessage("Atleast 2 Characters long")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("First Name Should Contain Only Letters"),
  
  check('lastname')
  .notEmpty()
  .withMessage("Last Name Is Required")
  .trim()
  .isLength({min : 2})
  .withMessage("Atleast 2 Characters long")
  .matches(/^[a-zA-Z\s]+$/)
  .withMessage("Last Name Should Contain Only Letters"),

  check('email')
  .isEmail()
  .withMessage('Enter Valid Email')
  .normalizeEmail(),

  check('password')
  .isLength({min : 8})
  .withMessage("Password should be Atleast 8 Characters")
  .matches(/[a-z]/)
  .withMessage("Password Contain Atleast one LowerCase")
  .matches(/[A-Z]/)
  .withMessage("Password Contain Atleast one UpperCase")
  .matches(/[!@#$%^^&*()]/)
  .withMessage("Password Contain Atleast one Special Character")
  .trim(),

  check('confirmpassword')
  .trim()
  .custom((value,{req}) => {
    if (value  != req.body.password) {
      throw new Error("password Didnt match")
    }
    return true;
  }) ,

  check('accountType')
  .notEmpty()
  .withMessage("User Type Is Required")
  .isIn(['user','host'])
  .withMessage("invalid User Type"),
  check('check')
  .notEmpty()
  .withMessage("Accept T&C")
  .custom((value) => {
    if(value !== 'on'){
      throw new Error("Accept T&C")
    }
    return true;
  })  
  ,(req,res) => {
  console.log(req.body);
  const {firstname,lastname,email,password,accountType} = req.body;
  const errors = validationResult(req);

    if(!errors.isEmpty()){
      return res.status(422).render('signup',{
        isLoggedIn : false,
        errors : errors.array().map(err => err.msg),
        oldInput : {
          firstname,
          lastname,
          email,
          password,
          accountType
        },
        user : {}
      })
    }

    bcrypt.hash(password,12).then(hashedpassword => {
      const user = new User({firstname : firstname,
        lastname : lastname,
        email : email,
        password : hashedpassword,
        accountType : accountType});

       return user.save()
    })
    .then(() => {
      res.redirect('/login');
    })
    .catch(err => {
      return res.status(422).render('signup',{
        isLoggedIn : false,
        errors : [err.message],
        oldInput : {
          firstname,
          lastname,
          email,
          password,
          accountType
        },
        user : {}
      })
    })

    // const user = new User({firstname,lastname,email,password,accountType});
    // user.save()
    // .then(() => {res.redirect('/login')})
    // .catch(err => {
    //   return res.status(422).render('signup',{
    //     isLoggedIn : false,
    //     errors : [err.message],
    //     oldInput : {
    //       firstname,
    //       lastname,
    //       email,
    //       password,
    //       accountType
    //     }
    //   })
    // })
}]
