
import UsersStore from "../classes/UsersStore";
import { Request } from "../types";


export const userInfoRoute= (app,usersStore:UsersStore)=>{

    app.get('/userInfo',async(req:Request,res)=>{
        const {uid,email} = req.userInfo;
    
      
        try {
            // Retrieve user-specific messages from the pg database
            const userInfo = await usersStore.getOrRegisterUser(uid,email);
            res.json(userInfo);
        } catch (error) {
            console.error('Error retrieving user info:', error);
            res.status(500).json({ error: 'Failed to retrieve user information' });
        }
    })

}