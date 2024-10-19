import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { AdapterUser } from "next-auth/adapters";
import { prisma } from "../prisma/prisma";
import { createId } from "@paralleldrive/cuid2";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (user: AdapterUser) => {
      const data = {
        id: createId(),
        email: user.email,
        emailVerified: user.emailVerified,
        name: user.name ?? "Anonymous User",
        image: user.image,
      };

      return await prisma.user.create({ data });
    },
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      const redirectIfLoggedIn = ["/", "/login", "/register"];
      const isOnProtectedPage = pathname.startsWith("/dashboard");

      if (isLoggedIn && redirectIfLoggedIn.includes(pathname)) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      if (!isLoggedIn && isOnProtectedPage) {
        return Response.redirect(new URL("/login", nextUrl));
      }

      if (!isLoggedIn && !redirectIfLoggedIn.includes(pathname)) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      session.user = { id: token.id as string } as AdapterUser & { id: string };
      return session;
    },
  },
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Github({
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
});
