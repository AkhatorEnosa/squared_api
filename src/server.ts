import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.ts';
import postRoutes from './routes/postRoutes.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to the Squared API');
})

app.use('/auth', authRoutes);
app.use('/posts', postRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});