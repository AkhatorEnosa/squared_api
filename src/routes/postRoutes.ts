import express from 'express'
import { prisma } from '../../lib/prisma.ts';
import authMiddleware from '../middleware/authMiddleware.ts';

const router = express.Router();

// get all posts
router.get('/', async (req, res) => {
    try {
        
        const posts = await prisma.post.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
                featured: true,
                // select the User (the author)
                author: {
                    select: {
                        id: true,
                        name: true,
                        // Then, nest the Profile selection inside the author
                        profile: {
                            select: {
                                userImageUrl: true,
                            },
                        },
                    },
                },
                reactions: {
                    select: {
                        type: true,
                        userId: true,
                    }
                }
                ,
                _count: {
                    select: {
                        reactions: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(posts);
        
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error fetching posts');
        
    }
});

// create a new post
router.post('/create', authMiddleware, async (req, res) => {
    const { title, content, imgurl } = req.body;

    // check if user is authorized
    if (!req.userID) {
        return res.status(400).send('Not authorized');
    }

    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    try {
        // find similar post by the same user
        const existingPost = await prisma.post.findFirst({
            where: {
                title: title.trim(),
                content: content.trim(),
                authorId: req.userID
            }
        });

        if (existingPost) {
            return res.status(400).send('You already have a similar post');
        }

        await prisma.post.create({
            data: {
                title: title.trim(),
                content: content.trim(),
                imageUrl: imgurl ? imgurl.trim() : null,
                published: true,
                authorId: req.userID
            }
        });
        console.log(req.userID, 'created a new post:');
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating post');
    }
});

// update a post 
router.put('/update/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { title, content, imgurl } = req.body;

    // check if user is authorized
    if (!req.userID) {
        return res.status(400).send('Not authorized');
    }

    if (!title || !content) {
        return res.status(400).send('Title and content are required');
    }

    try {
        const updatedPost = await prisma.post.updateMany({
            where: {
                id: postId,
                authorId: req.userID
            },
            data: {
                title: title ? title.trim() : undefined,
                content: content ? content.trim() : undefined,
                imageUrl: imgurl ? imgurl.trim() : undefined
            }
        });

        if (updatedPost.count === 0) {
            return res.status(404).send('Post not found or not authorized');
        }

        res.json({ message: 'Post updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating post');
    }
})

// delete a post for authorized user
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    // check if user is authorized
    if (!req.userID) {
        return res.status(400).send('Not authorized');
    }

    try {
        const deletedPost = await prisma.post.deleteMany({
            where: {
                id: id,
                authorId: req.userID
            }
        });

        if (deletedPost.count === 0) {
            return res.status(404).send('Post not found or not authorized');
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting post');
    }
})

// add reaction to post 
router.post('/react/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { type } = req.body;

    // check if user is authorized
    if (!req.userID) {
        return res.status(400).send('Not authorized');
    }

    // if (!type) {
    //     return res.status(400).send('Reaction type is required');
    // }

    try {
        // check if reaction already exists
        const existingReaction = await prisma.reactions.findFirst({
            where: {
                postId: postId,
                userId: req.userID
            }
        });

        if (existingReaction) {
            // update existing reaction
            await prisma.reactions.update({
                where: {
                    id: existingReaction.id
                },
                data: {
                    type: type
                }
            });
            return res.json({ message: 'Reaction updated successfully' });
        } else {
            // create new reaction
            await prisma.reactions.create({
                data: {
                    type: type,
                    postId: postId,
                    userId: req.userID
                }
            });
            return res.status(201).json({ message: 'Reaction added successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding reaction');
    }
});

export default router;