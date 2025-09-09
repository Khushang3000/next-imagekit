import { authOptions } from "@/utils/auth";
import NextAuth from "next-auth";
//here we'll use nextauth and authOptions as well.
//also see line 9 of route.ts from register.
//now go see authOptions file.

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};