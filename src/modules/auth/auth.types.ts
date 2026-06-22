import type { UserRole } from "@prisma/client";

export type LoginInput = {
	email: string;
	password: string;
};

export type PublicUser = {
	id: string;
	name: string;
	email: string;
	role: UserRole;
};

export type JwtAuthPayload = {
	userId: string;
	email: string;
	role: UserRole;
};

export type LoginResult = {
	token: string;
	user: PublicUser;
};