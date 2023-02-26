import { verify } from 'jsonwebtoken';
import config from '../../config/index';
import { User } from '../../models/index';

const auth = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ','');
        const decoded = verify(token, config.JWT);
        const user = await User.findOne({_id:decoded._id, 'tokens.token':token})
        if(!user) {
            throw new Error();
        }
        req.token = token
        req.user = user
        next()
    } catch (error) {
       res.status(401).send({msgText:"Please Authenticate!", success: false})
    }
    
}

export default auth;