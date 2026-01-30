import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import type { NextFunction, Request, Response } from 'express';
import { json } from 'express'
import formidable from 'formidable';
import { randomUUID } from 'crypto';

export type UploadedFile = {
    name: string;
    size: number;
    path: string;
};

declare module "express" {
    interface Request {
        sessionToken?: string;
        files?: UploadedFile[];
    }
}


export const ENV = {
    MAX_SESSION_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
    PORT: process.env.PORT || 3001,
    ROOT_PASS: process.env.ROOT_PASSWORD || (() => { throw new Error("ROOT_PASSWORD not set in env") })(),
}

export const uploadsDir = path.resolve(path.join(process.cwd(), "uploads/backend"));

export function bodyParser(req: Request, res: Response, next: NextFunction) {
    const type = req.headers['content-type'];
    if (type?.includes('application/json')) {
        return json()(req, res, next);
    }
    else if (type?.includes('multipart/form-data')) {
        const form = formidable({
            uploadDir: uploadsDir,
            keepExtensions: true,
            multiples: true,
            maxFileSize: 10 * 1024 * 1024, // 10 MB
            filename: (name, ext, part, form) => {
                return `${randomUUID()}${ext}`;
            }
        });
        form.parse(req, (err, fields, files) => {
            if (err) {
                next(err);
            }
            req.body = fields.data ? JSON.parse(fields.data[0] as string) : {};
            const result: UploadedFile[] = [];

            for (const key in files) {
                const value = files[key];
                if (!value) continue;

                const fileArray = Array.isArray(value) ? value : [value];

                for (const file of fileArray) {
                    result.push({
                        name: file.newFilename,   // stored name
                        size: file.size,
                        path: file.filepath,
                    });
                }
            }
            req.files = result;
        });
    }
    next();
}

export function getDir(subPath: string) {
    const fullPath = path.join(uploadsDir, subPath);
    if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true });
    }
    return fullPath;
}

export function initialize() {
    if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
    }
} 