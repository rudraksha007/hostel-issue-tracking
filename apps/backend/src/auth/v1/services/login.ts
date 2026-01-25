import { AuthError, DatabaseError, NotFoundError, ServerError } from "@repo/shared/errors";
import bcrypt from "bcryptjs";
import { prisma, UserType } from "@repo/db";
import { ENV } from "@/lib/init";
import type { APIResponseT, LoginRequestT } from "@repo/shared/types/api";

export type LoginServiceResult = {
    id: string;
    name: string;
    userType: UserType;
    sessionToken: string;
    age: number;
}

export async function login({ id, password, remember }: LoginRequestT, ipAddress: string, deviceInfo: string): Promise<APIResponseT<LoginServiceResult>> {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { email: id },
                { phone: id },
                { id }
            ]
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            password: true,
            userType: true
        }
    });

    if (!user) throw new NotFoundError("User not found");
    const isPassValid = bcrypt.compareSync(password, user.password);
    if (!isPassValid) throw new AuthError("Invalid credentials");
    const sessionToken = crypto.randomUUID();
    const age = (!remember ? 60 * 60 : ENV.MAX_SESSION_AGE) * 1000; // 1 hour if not remember, else default max age
    await prisma.session.create({
        data: {
            sessionToken,
            user: {
                connect: {
                    id: user.id
                }
            },
            ipAddress,
            deviceInfo,
            expires: new Date(Date.now() + age)
        }
    });
    const data: LoginServiceResult = {
        id: user.id,
        name: user.name,
        sessionToken: sessionToken,
        userType: user.userType,
        age
    }
    return { success: true, data, msg: "Login successful", statusCode: 200 };
};