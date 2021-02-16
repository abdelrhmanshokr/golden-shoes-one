const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.decode(token, 'secret');
        if(decoded.isAdmin){
            console.log(decoded.isAdmin);
            next();
        }
    }catch(error){
        return res.status(403).json({
            message: 'Authorization failed'
        });
    }
}