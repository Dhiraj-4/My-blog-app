import express from 'express';
import { PORT } from './config/serverConfig.js';
import { connectDB } from './config/dbConfig.js';
import morgan from 'morgan';
import apiRouter from './routes/apiRoutes.js'

const app = new express();

app.use(morgan('combined'));
app.use(express.json());

app.get('/', (req,res) => {
    console.log('You are on the home page');
    return res.json({
        message: 'Home page',
        success: true
    })
})

app.use('/api', apiRouter); 

app.all('*', (req, res) => {
    return res.status(404).json({
        message: 'Not found',
        success: false
    })
})

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is up on ${PORT}`);
})