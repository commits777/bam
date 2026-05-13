import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

/* ── Instagram OAuth provider ────────────────────────────────
   Uses the new Instagram Login API (2024+).
   Requires a Meta developer app with "Instagram Login" product.
   Callback URL: [domain]/api/auth/callback/instagram
   Env vars: AUTH_INSTAGRAM_ID, AUTH_INSTAGRAM_SECRET
   ─────────────────────────────────────────────────────────── */
const Instagram = {
  id: "instagram",
  name: "Instagram",
  type: "oauth" as const,
  clientId: process.env.AUTH_INSTAGRAM_ID!,
  clientSecret: process.env.AUTH_INSTAGRAM_SECRET!,
  authorization: {
    url: "https://www.instagram.com/oauth/authorize",
    params: { scope: "instagram_business_basic" },
  },
  token: {
    url: "https://api.instagram.com/oauth/access_token",
    async request({ params, provider }: { params: Record<string, string>; provider: { clientId: string; clientSecret: string } }) {
      const body = new URLSearchParams({
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        grant_type: "authorization_code",
        redirect_uri: params.redirect_uri ?? "",
        code: params.code ?? "",
      });
      const res = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        body,
      });
      const tokens = await res.json();
      return { tokens };
    },
  },
  userinfo: {
    url: "https://graph.instagram.com/v21.0/me?fields=id,username,name,profile_picture_url",
  },
  profile(profile: { id: string; username?: string; name?: string; profile_picture_url?: string }) {
    return {
      id: String(profile.id),
      name: profile.name ?? profile.username ?? `ig_${profile.id}`,
      email: `ig_${profile.id}@bam.placeholder`,
      image: profile.profile_picture_url ?? null,
    };
  },
};

const providers = [
  ...(process.env.AUTH_INSTAGRAM_ID ? [Instagram] : []),
  ...(process.env.AUTH_GOOGLE_ID
    ? [Google({ clientId: process.env.AUTH_GOOGLE_ID, clientSecret: process.env.AUTH_GOOGLE_SECRET! })]
    : []),
  GitHub({
    clientId: process.env.AUTH_GITHUB_ID!,
    clientSecret: process.env.AUTH_GITHUB_SECRET!,
  }),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: string }).role ?? "user";
        session.user.bio = (user as { bio?: string }).bio ?? null;
        session.user.instagram = (user as { instagram?: string }).instagram ?? null;
        session.user.phone = (user as { phone?: string }).phone ?? null;
      }
      return session;
    },
    async signIn({ user, profile }) {
      const isAdminEmail = user.email === process.env.ADMIN_EMAIL;
      const isAdminInstagram =
        (profile as { username?: string } | undefined)?.username === "ian_g477";

      if (isAdminEmail || isAdminInstagram) {
        await prisma.user
          .update({ where: { email: user.email! }, data: { role: "admin" } })
          .catch(() => {});
      }
      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      bio?: string | null;
      instagram?: string | null;
      phone?: string | null;
    };
  }
}
