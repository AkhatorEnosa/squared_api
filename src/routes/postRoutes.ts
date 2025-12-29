import express from 'express'
import { prisma } from '../../lib/prisma.ts';
import authMiddleware from '../middleware/authMiddleware.ts';

const router = express.Router();

// get all posts
router.get('/', async (req, res) => {
    const posts = await prisma.post.findMany({
        where:
        {
            published: true
        }
    });
    res.json(posts);
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

// get posts by user
// router.get('/user/:userId', async (req, res) => {
//     const { userId } = req.params;

//     try {
//         const userPosts = await prisma.post.findMany({
//             where: {
//                 authorId: userId,
//                 published: true
//             }
//         });
//         res.json(userPosts);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error fetching user posts');
//     }
// });

export default router;