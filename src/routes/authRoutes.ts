import express from 'express'
import bycrpt from 'bcryptjs';
import { prisma } from '../../lib/prisma.ts';
import jwt from 'jsonwebtoken';


const router = express.Router();

// user register
router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    
    // function to sanitize all inputs
    // const sanitizeInput = (input: string) => {
    //     return input.replace(/<[^>]*>?/gm, '').trim();
    // }

    // validate input
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).send('Please fill in all fields');
    }

    // verify password match 
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const validateStrongPassword = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // Min 8 chars, 1 letter, 1 number
    if (!validateStrongPassword.test(password)) {
        return res.status(400).json({ error: "Password too weak. " });
    }

    // encrypt password 
    const hashedPassword = await bycrpt.hash(password, 10);

    // save user to database (pseudo code)
    try {
        
        // verify if user already exists 
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return  res.status(400).send('User already exists with this email');
        }

        // insert user to database 
        const user = await prisma.user.create({
            data: {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password: hashedPassword
            }
        })

        if (user) {
            const defaultPost = `Hi guys, my name is ${user.name} and I just joined this awesome platform!`;

            // create profile 
            const createProfile = await prisma.profile.create({
                data: {
                    userImageUrl: `https://api.dicebear.com/9.x/personas/svg?seed=${user.name}`,
                    userId: user.id
                }
            })


            if (createProfile) {
                // create default post for the user
                const createPost = await prisma.post.create({
                    data: {
                        title: "Welcome " + user.name,
                        content: defaultPost,
                        authorId: user.id
                    }
                }) 

                if (!createPost) {
                    // rollback user and profile creation
                    await prisma.profile.delete({
                        where: { id: createProfile.id }
                    });

                    await prisma.user.delete({
                        where: { id: user.id }
                    });

                    return res.status(400).send('User registration failed');
                }
            } else {
                await prisma.user.delete({
                    where: { id: user.id }
                });
            }

            
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not defined in environment variables');
            }

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            
            res.json({ message: 'User registered successfully', token });
        } else {
            console.log('User creation failed');
            return res.status(400).send('User registration failed');
        }


    } catch (error) {
        console.log(error.message)
        res.status(500).send('Error registering user');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // verify all inputs
    if (!email || !password) {
        return res.status(400).send({ message : 'Please fill in all fields'});
    }

    // login 
    try {
        // check if user exists
        const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        });

        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        // verify password
        const isPasswordValid = await bycrpt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        // generate JWT token
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined in environment variables');
        }

        // sign token
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'User logged in successfully', token });
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ message: 'Error logging in user' });
    }
});

export default router;