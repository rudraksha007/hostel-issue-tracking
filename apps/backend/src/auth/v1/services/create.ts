import { prisma } from "@repo/db";
import { DuplicateActionError } from "@repo/shared/errors";
import { makeResponse, type APIResponseT, type CreateUserRequestT } from "@repo/shared/types/api";

export async function create({ name, email, phone, userType, gender, seat }: CreateUserRequestT): Promise<APIResponseT> {
    const dbUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                { phone },
                ...(seat ? [{
                    seat: {
                        id: seat
                    }
                }] : [])
            ]
        }, select: {
            id: true,
            seat: {
                select: {
                    id: true
                }
            }
        }
    });
    if (dbUser) {
        if (dbUser.seat?.id === seat) throw new DuplicateActionError("Seat is already assigned to another user");
        throw new DuplicateActionError("User with given email or phone number already exists");
    }
    await prisma.user.create({
        data: {
            name,
            email,
            password: "", // Empty password, to be set during signup
            isInit: false,
            phone,
            userType,
            gender,
            ...(seat? {
                seat: {
                    connect: {
                        id: seat
                    }
                }
            }: {})
        }
    });
    return makeResponse(true, 201, "User created successfully");
}