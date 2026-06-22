import prisma from "@root/prisma.js";
import { AppError } from "../../utils/errors.js";
import { comparePassword } from "../../utils/bcrypt.js";
import { signJwtToken } from "../../utils/jwt.js";
import type { JwtAuthPayload, LoginInput, LoginResult, PublicUser } from "./auth.types.js";

function toPublicUser(user: { id: string; name: string; email: string; role: PublicUser["role"] }): PublicUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role,
	};
}

export async function login(input: LoginInput): Promise<LoginResult> {
	const user = await prisma.user.findUnique({
		where: { email: input.email.toLowerCase() },
	});

	if (!user) {
		throw new AppError("Invalid email or password", 401);
	}

	if (!user.isActive) {
		throw new AppError("Account is inactive", 403);
	}

	const passwordMatched = await comparePassword(input.password, user.passwordHash);

	if (!passwordMatched) {
		throw new AppError("Invalid email or password", 401);
	}

	const payload: JwtAuthPayload = {
		userId: user.id,
		email: user.email,
		role: user.role,
	};

	const [token] = await Promise.all([
		Promise.resolve(signJwtToken(payload)),
		prisma.user.update({
			where: { id: user.id },
			data: { lastLoginAt: new Date() },
		}),
	]);

	return {
		token,
		user: toPublicUser(user),
	};
}

export async function getCurrentUser(userId: string): Promise<PublicUser> {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isActive: true,
		},
	});

	if (!user || !user.isActive) {
		throw new AppError("User not found", 404);
	}

	return toPublicUser(user);
}