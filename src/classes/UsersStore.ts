// import { Redis } from 'ioredis';
import { User } from '../db/models';
// import s3Service from './s3Service';
import { Op } from 'sequelize';
// import { LocationObject, UserIdentifier, UserRecord } from '../types/serverTypes';
// import UserSessionStore from './UsersSessionStore';
import dotenv from 'dotenv';
import { UserRecord } from '../types';


dotenv.config();




class UsersStore{

    private userModel:typeof User;
    // private s3Service:typeof s3Service;

    constructor(){
        // this.userSessionStore= new UserSessionStore(redisClient);
        this.userModel=User;
        // this.s3Service=s3Service;
    }


    // async getUserStatus(id:string){
    //     try {
    //         const userStatus= await this.userSessionStore.findUserStatus(id)
    //         return userStatus
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error in getting user status',error);
    //         console.log('====================================');
    //         return { userId:id, connected: false,  devicePushToken:""}
    //     }
    // }


    // async saveUserSession(id:string,connected:boolean,devicePushToken:string){
        
    //     try{
    //         const {devicePushToken:currentToken}= await this.userSessionStore.findUserStatus(id);
    //         if(currentToken!==devicePushToken){
    //             await this.userModel.update({deviceToken: devicePushToken}, { where: { id: id } });
    //         }
    //         this.userSessionStore.saveUserStatus(id,{connected,devicePushToken})
    //     }catch(err){
    //         console.log('====================================');
    //         console.log('error saving user session',err);
    //         console.log('====================================');
    //     }

        
    // }

    
    // getUserPushToken=async(userId:string)=>{
    //     try {
    //         const {devicePushToken}= await this.userSessionStore.findUserStatus(userId);

    //         if (!devicePushToken) {
    //             // get the device token from the database
    //             const user = await this.userModel.findOne({ where: { id: userId } });
    //             if (!user) {
    //                 throw new Error("User not found in database");
    //             }
    //             if (!user.deviceToken) {
    //                 throw new Error("User does not have a device token");
    //             }
    //             return user.deviceToken;
    //         }

    //         return devicePushToken
            
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error getting push token',error);
    //         console.log('====================================');
    //         return null
    //     }
    // }


    // async userLogout(id:string){
    //     try{
    //         this.userSessionStore.removeUserToken(id)
    //         await this.userModel.update({deviceToken: ""}, { where: { id: id } });
    //     }catch(err){
    //         console.log('====================================');
    //         console.log('error logging out user',err);
    //         console.log('====================================');
    //     }
    // }


    // async saveUserPicture(id: string, imageKey: string) {
    //     try {
    //         const user = await this.userModel.findOne({ where: { id: id } });
    //         if (!user) {
    //             throw new Error("User not found in database");
    //         }
    //         // for now we will only allow one profile picture
    //         if (user.photoUrls?.length > 0) {
    //             const previousImageKey = user.photoUrls[0];
    //             // delete previous profile picture
    //             await this.s3Service.deleteFile(previousImageKey);
    //         }
            
    //         user.photoUrls = [imageKey]; 
    //         const result= await user.save(); // Save the changes to the database
    //         return result

    //     } catch(err) {
    //         console.log('====================================');
    //         console.log('error saving user picture',err);
    //         console.log('====================================');
    //     }
    // }


    // async getUserPicture(id: string, index?: number) {

    //     try {
    //         const user = await this.userModel.findOne({ where: { id: id } });
    //         if (!user) {
    //             throw new Error("User not found in database");
    //         }
    //         if (index) {
    //             return user.photoUrls?.[index];
    //         }
    //         return user.photoUrls?.[0];
    //     } catch(err) {
    //         console.log('====================================');
    //         console.log('error getting user picture',err);
    //         console.log('====================================');
    //     }

    // }


    // async getBlockList(userId:string){

    //     const currentUser= await this.userModel.findOne({where:{id:userId}})
    //     const blockedUsers= currentUser?.blockedUsers||[]
    //     const blockedByUsers= currentUser?.blockedByUsers||[]
    
    //     return [...blockedUsers,...blockedByUsers]
    
    // }


    // async getSavedUsersPatch(userId:string,offset=0,limit=20){

    //     // exclude blocked users

    //     const blockedUsers= await this.getBlockList(userId)

    //     try {
    //         const users= await User.findAndCountAll({
    //             limit,
    //             offset,
    //             where:{
    //                 id:{
    //                     [Op.not]:userId,
    //                     [Op.notIn]:blockedUsers,

    //                 }
    //             },
    //             attributes:["id","username","photoUrls","location"]
    //         })
    //         return users

    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error getting saved users',error);
    //         console.log('====================================');
    //     }   
        

    // }

    async getUserInfo(userId:string){
        try {
            const user= await User.findByPk(userId);
            return user
        } catch (error) {
            console.log('====================================');
            console.log('error getting user info',error);
            console.log('====================================');
            return null
        }
    }

    // async getUserIdentifier(peerId:string):Promise<UserIdentifier>{

    //     try {
    //         const user= await this.getUserInfo(peerId);
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    //         const photoUrl= user?.photoUrls?.[0]? await s3Service.getSignedUrl(user.photoUrls[0]):null;

    //         return {
    //             id:user.id,
    //             username:user.username,
    //             location:user.location,
    //             photoUrl
    //         }
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error getting user identifier',error);
    //         console.log('====================================');
    //         return null
    //     }
    // }

    async createUser(userId:string,email:string){
        try {
            const user= await this.userModel.create({id:userId,username:email,email:email,registrationCompleted:false,balance:0,role:'user'})
            return user
        } catch (error) {
            console.log('====================================');
            console.log('error creating user',error);
            console.log('====================================');
            throw error
        }
    }

    async updateUser(userId:string,username:string,age:number,gender:string){
        
        try{
            
            const [,[updatedUser]] = await User.update(
                { username, age, gender, registrationCompleted:true}, // New field values as an object
                { where: { id: userId }, returning:true } // Filter condition
            );
            return updatedUser
        }catch(err){
            console.log('====================================');
            console.log('error updating user',err);
            console.log('====================================');
            throw err
        }

    }


    // async getFollowersUsersPatch(userId:string,offset=0,limit=20){

    //     try{

    //         const userFollowers = await UserFollow.findAll({
    //             where: { followingId: userId },
    //             attributes: ['followerId'],
    //             limit: limit,
    //             offset: offset,
    //         });
    //         const followerIds = userFollowers.map((follow) => follow.followerId);
    //         const followers = await User.findAll({
    //             where: { id: followerIds },
    //             attributes: ['id', 'username', 'photoUrls'],
    //         });

    //         const followersWithStatus=await Promise.all(followers.map(async (user:User)=>{
                
    //             let url=null;
                
    //             if (user.photoUrls?.length) {   
    //                 url = await s3Service.getSignedUrl(user.photoUrls[0]);
    //             }

    //             const {connected}= await this.userSessionStore.findUserStatus(user.id)
    //             const userData= user.toJSON()
                
    //             const followerData={
    //                 id:userData.id,
    //                 username:userData.username,
    //                 photoUrl:url,
    //                 connected
    //             }


    //             return followerData
    //         }))
    
    //         return {followersWithStatus, count: followerIds.length}

    //     }catch(err){
    //         console.log('====================================');
    //         console.log('error getting followers',err);
    //         console.log('====================================');
    //         throw err
    //     }

    // }

    // getFollowingUsersPatch=async(userId:string,offset=0,limit=20)=>{

    //     try {
    //         const userFollows = await UserFollow.findAll({
    //             where: { followerId: userId },
    //             attributes: ['followingId'],
    //             limit: limit,
    //             offset: offset,
    //         });
    //         const followingIds = userFollows.map((follow) => follow.followingId);
    //         const followings = await User.findAll({
    //             where: { id: followingIds },
    //             attributes: ['id', 'username', 'photoUrls'],
    //         });

    //         const followingWithStatus=await Promise.all(followings.map(async (user:User)=>{
    //             let url=null;
                
    //             if (user.photoUrls?.length) {   
    //                 url = await s3Service.getSignedUrl(user.photoUrls[0]);
    //             }

    //             const {connected}= await this.userSessionStore.findUserStatus(user.id)
    //             const userData= user.toJSON()
                
    //             const followingData={
    //                 id:userData.id,
    //                 username:userData.username,
    //                 photoUrl:url,
    //                 connected
    //             }


    //             return followingData
            
    //         }))



    //         return {followingWithStatus,count:followingIds.length}

    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error getting following',error);
    //         console.log('====================================');
    //         throw error
    //     }

    // }

 
    
    // getUsersWithStatus=async(userId:string,offset=0,limit=20)=>{

    //     try{
    //         const users= await this.getSavedUsersPatch(userId,offset,limit)



    //         const userWithStatus=await Promise.all(users.rows.map(async (user:User)=>{
    //             if (user.photoUrls?.length) {   
    //                 for (const photoUrl of user.photoUrls) {
    //                     const url = await s3Service.getSignedUrl(photoUrl);
    //                     // replace the photoUrl with the presigned url
    //                     user.photoUrls[user.photoUrls.indexOf(photoUrl)] = url;
    //                 }                    
    //             }


    //             const {connected}= await this.userSessionStore.findUserStatus(user.id)
                
                
    //             const userData= user.toJSON()
    //             return {...userData,connected}
            
    //         }))
            
    //         return {users:userWithStatus, count:users.count}

    //     }catch(err){
    //         console.log('====================================');
    //         console.log('error getting users with status',err);
    //         console.log('====================================');
    //         throw err
            

    //     }
        
    
    // }    

    getOrRegisterUser=async (userId:string,email:string)=>{

    

        let user:UserRecord|null

        try {
          
            const queryUser= await this.getUserInfo(userId)   
            
            user=queryUser 
                     
         // get presigned url for the user's profile picture
            // if (user?.photoUrls?.length) {
            //     for (const photoUrl of user.photoUrls) {
            //         const url = await s3Service.getSignedUrl(photoUrl);
            //         // replace the photoUrl with the presigned url
            //         user.photoUrls[user.photoUrls.indexOf(photoUrl)] = url;
            //     }
            // }   

        } catch (error) {
            console.log('====================================');
            console.log('error getting user',error);
            console.log('====================================');
            throw error

        }

        if (user) {
            return user
        
        }else{

            try {
               
                const newUser= await this.createUser(userId,email)            
                return newUser
            } catch (error) {
                console.log('====================================');
                console.log('error creating user',error);
                console.log('====================================');
                throw error
            }



        }
    }

    // async updateUserBalance(userId:string,amount:number){
    //     try {
    //         const user= await this.userModel.findOne({where:{id:userId}})
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    //         user.balance+=amount
    //         const updatedUser= await user.save()
    //         return updatedUser
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error updating user balance',error);
    //         console.log('====================================');
    //         throw error
    //     }
    // }

    // async getUserBalance(userId:string){

    //     try {
            
    //         const user= await this.userModel.findOne({where:{id:userId}})
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    //         return user.balance

    //     }catch(err){
    //         console.log('====================================');
    //         console.log('error getting user balance',err);
    //         console.log('====================================');
    //         throw err
    //     }


    // }

    // async getNumberOfMissedNotifications(userId:string){
    //     try {
    //         const user= await this.userModel.findOne({where:{id:userId}})
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    //         return user.numberOfMissedNotifications
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error getting missed notifications',error);
    //         console.log('====================================');
    //         throw error
    //     }
    // }

    // async resetMissedNotifications(userId:string){
    //     try {
    //         const user= await this.userModel.findOne({where:{id:userId}})
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    //         user.numberOfMissedNotifications=0
    //         await user.save()
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error resetting missed notifications',error);
    //         console.log('====================================');
    //         throw error
    //     }
    // }

    // async incrementMissedNotifications(userId:string){
    //     try {
    //         const user= await this.userModel.findOne({where:{id:userId}})
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    //         user.numberOfMissedNotifications+=1
    //         await user.save()
    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error incrementing missed notifications',error);
    //         console.log('====================================');
    //         throw error
    //     }
    // }

    async deleteUser(userId:string){
        try {

            // const userPictureName= await this.deleteUserPicture(userId);
            // await this.userSessionStore.deleteUser(userId)
            // await s3Service.deleteFile(userPictureName)

            const result= await this.userModel.destroy({where:{id:userId}})
            return result
        } catch (error) {
            console.log('====================================');
            console.log('error deleting user',error);
            console.log('====================================');
            throw error
        }
    }

    // async deleteUserPicture(userId:string){
    //     const user= await this.userModel.findOne({where:{id:userId}})
    //     if (!user) {
    //         throw new Error("User not found");
    //     }

    //     const userPictureName= user.photoUrls?.[0]
    //     user.photoUrls=[]
    //     await user.save()
    //     return userPictureName
    // }

    // async blockUser(userId:string,blockedUserId:string){
        
    //     try {
    //         const user= await this.userModel.findOne({where:{id:userId}})
    //         if (!user) {
    //             throw new Error("User not found");
    //         }
    //         const blockedUsers= [...(user.blockedUsers||[]),blockedUserId]
    //         user.blockedUsers=[...blockedUsers]
    //         await user.save()
            
    //         const blockedUser= await this.userModel.findOne({where:{id:blockedUserId}})
    //         if (!blockedUser) {
    //             throw new Error("Blocked user not found");
    //         }
    //         const blockedByUsers= [...(blockedUser.blockedByUsers||[]),userId]
    //         blockedUser.blockedByUsers=[...blockedByUsers]
    //         await blockedUser.save()

    //         // remove if there is a follow relationship either way

    //         await UserFollow.destroy({where:{followerId:userId,followingId:blockedUserId}})
    //         await UserFollow.destroy({where:{followerId:blockedUserId,followingId:userId}})


    //         return user
            


    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error blocking user',error);
    //         console.log('====================================');
    //         throw error
    //     }
    
    // }


    // getCountryNameBasedOnLocation = async (location: LocationObject) => {
    //     console.log('====================================');
    //     console.log('location', location);
    //     console.log('====================================');
    
    //     try {
    //         const apiKey = process.env.GEO_API_KEY; 
    //         const response = await fetch(`http://api.geoapify.com/v1/geocode/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&apiKey=${apiKey}`);
    //         const data = await response.json();

    
    //         return data.features[0].properties.country;

    //     } catch (err) {
    //         console.log('====================================');
    //         console.log('error getting country name', err);
    //         console.log('====================================');
    //         return null;
    //     }
    // }

    // async storeUserLocation(userId:string,locationCoord:LocationObject){
        
    //     try {

    //         const user= await this.userModel.findOne({where:{id:userId}})
           
    //         if (!user) {
    //             throw new Error("User not found");
    //         }

    //         const location= await this.getCountryNameBasedOnLocation(locationCoord)
           
    //         user.location=location
    //         await user.save()

    //         return location

    //     } catch (error) {
    //         console.log('====================================');
    //         console.log('error storing user location',error);
    //         console.log('====================================');
    //         throw error
    //     }
    // }
}


export default UsersStore;