import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";

import { prisma } from "@/lib/prisma";

const hasGoogle =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);
const hasEmail =
  Boolean(process.env.EMAIL_SERVER) && Boolean(process.env.EMAIL_FROM);

const providers = [];

if (hasGoogle) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  );
}

if (hasEmail) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  );
}

if (providers.length === 0) {
  providers.push(
    EmailProvider({
      server: {
        host: "localhost",
        port: 1025,
        auth: {
          user: "",
          pass: "",
        },
      },
      from: "devtoolbox@local.test",
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/login?sent=true",
  },
  callbacks: {
    session: ({ session, user }) => {
      if (session.user) {
        session.user.id = user.id;
        session.user.plan =
          (user as typeof user & { plan?: "FREE" | "PRO" | "TEAM" }).plan || "FREE";
      }
      return session;
    },
  },
};
