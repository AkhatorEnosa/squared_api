import express from 'express'
import { prisma } from '../../lib/prisma.ts';
import authMiddleware from '../middleware/authMiddleware.ts';

const router = express.Router();

// get authenticated user profile
router.get('/', authMiddleware, async (req, res) => {
    // check if user is authorized
    if (!req.userID) {
        return res.status(400).send('Not authorized');
    }

    try {
        
        const userProfile = await prisma.user.findUnique({
            where: { id: req.userID },
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        bio: true,
                        userImageUrl: true,
                        // location: true,
                        // website: true,
                    },
                },
            },
        });

        if (!userProfile) {
            return res.status(404).send('User not found');
        }

        res.json(userProfile);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching user profile');
        
    }
});

// get user profile by ID
router.get('/:userID', async (req, res) => {
    const { userID } = req.params;

    try {
        
        const userProfile = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true,
                name: true,
                email: true,
                profile: {
                    select: {
                        bio: true,
                        userImageUrl: true,
                        // location: true,
                        // website: true,
                    },
                },
            },
        });

        if (!userProfile) {
            return res.status(404).send('User not found');
        }

        res.json(userProfile);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching user profile');
        
    }
});

export default router;  