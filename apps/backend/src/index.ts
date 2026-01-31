import cookieParser from 'cookie-parser';
import express, { type Request, type Response } from 'express';
import { authRouter } from './auth';
import { parseSession } from '@/lib/middlewares/session';
import { bodyParser, ENV, initialize } from './lib/init';
import { issueRouter } from './issues';
import { announcementRouter } from './announcement';
import { lnfRouter } from './lnf';
import cors from 'cors'
import { usersRouter } from './users';
import { aggRouter } from './agg';
import { managementRouter } from './management';

const app = express();
initialize();

app.use(cors({
  origin: (origin, callback) => {
    // allow all origins dynamically
    callback(null, origin);
  },
  credentials: true,
}));
app.use((req: Request, res: Response, next)=> {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}: ${req.ip}`);
    next();
});
app.use(cookieParser(), parseSession);
app.use(bodyParser);
app.use("/api/auth", authRouter);
app.use("/api/issues", issueRouter);
app.use("/api/announcement", announcementRouter);
app.use("/api/lnf", lnfRouter);
app.use("/api/users", usersRouter);
app.use("/api/agg", aggRouter);
app.use('/api/management', managementRouter);

app.listen(ENV.PORT, () => {
    console.log(`Backend server running on port ${ENV.PORT}`);
});