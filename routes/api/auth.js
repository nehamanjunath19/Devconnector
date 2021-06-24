const express = require('express');
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult} = require('express-validator/check');
const router = express.Router();

const User = require('../../models/User');
//@route       GET api/auth
//@description Test route
//@access      Public

router.get('/', auth, async(req, res) => {
    try{
         const user = await User.findById(req.user.id).select('-password');
         res.json(user);
    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//@route       POST api/auth
//@description Authneticate User & Get token
//@access      Public

router.post('/', [
    
    check('email', 'Please include a valid emial').isEmail(),
    check('password', 'Password is required').exists()
],
 async (req, res) => {
   const errors = validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors: errors.array() });
   }

  
   const {email, password} = req.body;
 //See if user exists
    try{
        let user = await User.findOne({email});

        if(!user){
           return res.status(400).json({errors: [{ msg: 'Invalid Credentials'}] }); 
        }

const isMatch = await bcrypt.compare(password, user.password);

if(!isMatch){
    return res.status(400).json({errors: [{ msg: 'Invalid Credentials'}] });
}

   //Return jasonwebtoken
   const payload = {
       user: {
           id: user.id
       }
   };

   jwt.sign(
       payload, 
       config.get('jwtSecret'),
       {
           expiresIn: 36000
       },
       (err, token) => {
           if (err) throw err;
           res.json({token});
       });

   } catch(err){
console.error(err.message);
res.status(500).send('Server Error');
   }
  
   
});

module.exports = router;