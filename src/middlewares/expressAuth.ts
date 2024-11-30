import { NextFunction, Response } from "express";
import { getFbUser } from "../utility/firebaseAuth";
import { Request } from "../types";









const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send('No token provided');
    }

    const token = authHeader.split(' ')[1]; // Assuming 'Bearer <token>' format
    try {
        const {uid,email} = await getFbUser(token);
        req.userInfo = {uid,email}; // Attach user to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(403).send('Failed to authenticate token');
    }
};


export default authenticate;