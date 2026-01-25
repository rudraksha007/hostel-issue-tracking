import { prisma } from "@repo/db";
import { DuplicateActionError, NotFoundError } from "@repo/shared/errors";
import type { APIResponseT, SignupRequestT } from "@repo/shared/types/api";
import bcrypt from "bcryptjs";

export async function signup({ id, password }: SignupRequestT): Promise<APIResponseT> {
    const user = await prisma.user.findUnique({ where: { id }, select: { id: true, isInit: true } });
    if (!user) throw new NotFoundError("User not found");
    if (user.isInit) throw new DuplicateActionError("User is already registered");
    const hash = bcrypt.hashSync(password, 8);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hash,
            isInit: true
        }
    });
    return { success: true, statusCode: 200, msg: "User registered successfully" };
}