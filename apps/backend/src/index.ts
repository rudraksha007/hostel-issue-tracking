import cookieParser from 'cookie-parser';
import express from 'express';
import { authRouter } from './auth';
import { parseSession } from '@/lib/middlewares/session';
import { bodyParser, ENV, initialize } from './lib/init';
import { issueRouter } from './issues';
import { announcementRouter } from './announcement';

const app = express();
initialize();
app.use(cookieParser(), parseSession);
app.use(bodyParser);
app.use("/api/auth", authRouter);
app.use("/api/issue", issueRouter);
app.use("/api/announcement", announcementRouter);

app.listen(ENV.PORT, () => {
    console.log(`Backend server running on port ${ENV.PORT}`);
});