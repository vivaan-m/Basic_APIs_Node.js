const jwt = require('jsonwebtoken');
const User = require('../model/user');

const config = process.env;


const verifyToken=async (req,res,next)=>{
let data = {}
    const token = req.body.token||req.query.token||req.headers['x-access-token'];
    console.log(token);
    if(!token){
        return res.status(403).json({mssg:"A Token is required for auth"});
    }else{
        const user = await User.findOne({token:token});

        if(user){
        try {
            const decoded = jwt.verify(token,config.JWT_SECRET_TOKEN);
            req.user = decoded;
        } catch (err) {
            return res.status(400).json({mssg:"Invalid Token"})
        }
    
      
        return next();}else{
            return res.status(400).json({mssg:"Invalid Token"})
        }
    }
    
}   


module.exports = verifyToken;