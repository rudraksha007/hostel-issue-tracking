import path from 'path';
import { existsSync, mkdirSync } from 'fs';

export const ENV = {
    MAX_SESSION_AGE: 30 * 24 * 60 * 60, // 30 days in seconds
    PORT: process.env.PORT || 3001,
}

export const uploadsDir = path.join(process.cwd(), "uploads/backend");

export function initialize() {
    if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
    } 
} 