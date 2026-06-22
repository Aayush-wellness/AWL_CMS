import type { UserRole } from "@prisma/client";

declare global {
  namespace Express {
    interface User {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      isActive?: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};