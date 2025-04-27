import express from 'express';
import { PORT } from './config/serverConfig.js';

const app = new express();

app.listen(8080, () => {
    console.log(`Server is up on ${PORT}`);
})