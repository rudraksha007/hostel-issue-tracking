import cookieParser from 'cookie-parser';
import express from 'express';
import { authRouter } from './auth';
import { parseSession } from '@/lib/middlewares/session';
import { ENV, initialize } from './lib/init';

const app = express();
initialize();
app.use(express.json());
app.use(cookieParser());
app.use(parseSession);
app.use("/api/auth", authRouter);

app.listen(ENV.PORT, () => {
    console.log(`Backend server running on port ${ENV.PORT}`);
});