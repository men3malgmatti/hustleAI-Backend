
import { Request } from "../types";
import { getUserById } from "../utility/firebaseAuth";



const verifyAdmin = async (req: Request, res, next) => {
    
    
    try {

            
        const { uid } = req.userInfo;
        const user = await getUserById(uid);
        if (user.customClaims && user.customClaims.admin) {
            next();
        } else {
            res.status(403).json({ error: 'Unauthorized' });
        }
        

    } catch (error) {
        
        console.log('Error verifying admin:', error);
        res.status(500).json({ error: 'Failed to verify admin' });
    }

}


export default verifyAdmin;