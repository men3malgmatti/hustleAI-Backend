import { credential } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import dotenv from 'dotenv';
import { initializeApp } from "firebase-admin/app";

dotenv.config();

const initAuth = () => {

    console.log('====================================');
    console.log(process.env.FB_CONFIG_projectId);
    console.log('====================================');
    

    const fbApp = initializeApp({
        credential:credential.cert({
                projectId: process.env.FB_CONFIG_projectId,
                clientEmail: process.env.FB_CONFIG_clientEmail,
                privateKey: process.env.FB_CONFIG_privateKey,
        }),
    });


    const getUserByEmail=async (email:string)=>{
        try {
            const userRecord = await getAuth(fbApp).getUserByEmail(email);
            console.log(`Successfully fetched user data: ${userRecord.uid}`);
            return userRecord
        } catch (error) {
            console.log('Error fetching user data:', error);
            throw error
        }
    }

    const getUserById=async (uid:string)=>{
        try {
            const userRecord = await getAuth(fbApp).getUser(uid);
            console.log(`Successfully fetched user data: ${userRecord.uid}`);
            return userRecord
        } catch (error) {
            console.log('Error fetching user data:', error);
            throw error
        }
    }


    const setAdmin= async ()=>{


        try {

            const userRecord = await getUserByEmail(process.env.ADMIN_EMAIL);
            console.log(`Successfully fetched user data: ${userRecord.uid}`);
            await getAuth(fbApp).setCustomUserClaims(userRecord.uid, {admin: true});
            console.log(`Successfully set admin role to user: ${userRecord.uid}`);
        
        } catch (error) {
        
            console.log('Error setting admin role:', error);
            throw error
        }
     
    }

    const getFbUser=async (accessToken:string)=>{
        
        try {
            
            const decodedToken=await getAuth(fbApp).verifyIdToken(accessToken);
            
                  // See the UserRecord reference doc for the contents of userRecord.
            console.log(`Successfully fetched user data: ${decodedToken}`);
            return decodedToken
        
        } catch (error) {
            console.log('Error fetching user data:', error);
            throw error
        }
        
    }

    const deleteFbUser=async (uid:string)=>{
            
            try {
                
                await getAuth(fbApp).deleteUser(uid);
                
                console.log(`Successfully deleted user data: ${uid}`);
            
            } catch (error) {
                console.log('Error deleting user data:', error);
                throw error
            }
    }

    
    const createFbUser=async (email:string,password:string)=>{
            
            try {
                
                const userRecord = await getAuth(fbApp).createUser({
                    email,
                    password,
                });
                
                // See the UserRecord reference doc for the contents of userRecord.
                console.log(`Successfully created new user: ${userRecord.uid}`);
                return userRecord
            
            } catch (error) {
                console.log('Error creating user:', error);
                throw error
            }
            
    }
    


    return {getFbUser,deleteFbUser, createFbUser, setAdmin, getUserByEmail, getUserById}
}


export const {getFbUser,deleteFbUser, createFbUser, setAdmin, getUserById, getUserByEmail}= initAuth();
