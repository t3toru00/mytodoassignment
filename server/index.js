import express from 'express';
import cors from 'cors';
import todoRouter from './router/todoRouter.js';
import userRouter from './router/userRouter.js';


const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', todoRouter);
app.use('/user', userRouter);
app.use((err, req, res, next) => {
   const statusCode = err.status || 500;
   res.status(statusCode).json({
       error: err.message
   });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

