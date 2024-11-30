
import UsersStore from "../classes/UsersStore";
import { Request } from "../types";



export const completeRegistrationRoute= (app,usersStore:UsersStore)=>{

    app.post('/completeRegistration',async(req:Request,res)=>{

        try {
            const {username,age,gender}= req.body
            const {uid} = req.userInfo;
            const updatedUser= await usersStore.updateUser(uid,username,age,gender)
            res.json(updatedUser)                    
        } catch (error) {
            console.log("error completing registration",error);
            res.status(500).json({ error: 'Failed to complete registration' });            
        }

    })
}