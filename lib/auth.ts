import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";

const hasGoogle =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);
const hasSmtp =
  Boolean(process.env.EMAIL_SERVER) && Boolean(process.env.EMAIL_FROM);
const hasResend =
  Boolean(process.env.RESEND_API_KEY) && Boolean(process.env.EMAIL_FROM);

const providers = [];

if (hasResend) {
  const resend = new Resend(process.env.RESEND_API_KEY!);

  providers.push(
    EmailProvider({
      // Kept for compatibility; delivery is handled by sendVerificationRequest.
      server: { jsonTransport: true },
      from: process.env.EMAIL_FROM!,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        const host = new URL(url).host;
        const subject = `Sign in to DevToolbox`;

        const html = `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
            <h2 style="margin:0 0 12px 0;color:#0F172A;">Sign in to DevToolbox</h2>
            <p style="color:#334155;font-size:14px;line-height:1.5;">
              Click the button below to securely sign in to your account.
            </p>
            <a href="${url}" style="display:inline-block;margin-top:12px;padding:12px 18px;border:3px solid #000;background:#FFD600;color:#000;text-decoration:none;font-weight:700;border-radius:10px;">
              Open DevToolbox
            </a>
            <p style="color:#64748B;font-size:12px;margin-top:16px;">
              If you did not request this email, you can safely ignore it.
            </p>
            <p style="color:#64748B;font-size:12px;">Host: ${host}</p>
          </div>
        `;

        const text = `Sign in to DevToolbox\n${url}\n\nHost: ${host}`;

        const { error } = await resend.emails.send({
          from: provider.from as string,
          to: identifier,
          subject,
          html,
          text,
        });

        if (error) {
          throw new Error(error.message || "Failed to send magic link via Resend");
        }
      },
    }),
  );
} else if (hasSmtp) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER!,
      from: process.env.EMAIL_FROM!,
    }),
  );
} else {
  providers.push(
    EmailProvider({
      // Dev fallback: avoid SMTP dependency and print magic link to server logs.
      server: { jsonTransport: true },
      from: "devtoolbox@local.test",
      sendVerificationRequest: async ({ identifier, url }) => {
        // eslint-disable-next-line no-console
        console.info(
          `[Auth:MagicLink]\nUser: ${identifier}\nOpen this URL to sign in:\n${url}\n`,
        );
      },
    }),
  );
}

if (hasGoogle) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/login?sent=true",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.plan = (user as typeof user & { plan?: "FREE" | "PRO" | "TEAM" }).plan || "FREE";
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.plan = (token.plan as "FREE" | "PRO" | "TEAM") || "FREE";
      }
      return session;
    },
  },
};
