import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // look for token in request headers
    const token = req.headers['authorization'];

    // token available check
    if (!token) {
        return res.status(401).send({ message: 'No token provided' });
    }

    try {
        
        if(!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
            req.userID = decoded.id; // Attach user ID to request object
        } else {
            throw new Error('Invalid token payload');
        }
        next(); // Move to the next middleware or route handler
    } catch (error) {
        console.log("Error in auth middleware:", error);
        return res.status(401).json({ message: 'Failed to authenticate token' });
    }
}

export default authMiddleware;