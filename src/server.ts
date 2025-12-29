import express from 'express';
import authRoutes from './routes/authRoutes.ts';
import postRoutes from './routes/postRoutes.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the API');
})

app.use('/auth', authRoutes);
app.use('/post', postRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});