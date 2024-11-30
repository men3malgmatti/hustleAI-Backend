import UsersStore from "../classes/UsersStore";
import { Request } from "../types";
import { deleteFbUser } from "../utility/firebaseAuth";


export const deleteUserRoute= (app,usersStore:UsersStore)=>{

    app.delete('/deleteUser',async(req:Request,res)=>{
        const {uid} = req.userInfo;
    
        console.log('====================================');
        console.log('deleting user',uid);
        console.log('====================================');
        
      
        try {
            // Retrieve user-specific messages from the pg database
            const userInfo = await usersStore.deleteUser(uid);
            await deleteFbUser(uid);
            res.json(userInfo);
        } catch (error) {
            console.error('Error deleting user info:', error);
            res.status(500).json({ error: 'Failed to delete user information' });
        }
    })

}