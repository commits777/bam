import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import { prisma } from "@/lib/prisma";

/* ── Custom Instagram provider ──────────────────────────────
   Instagram doesn't return an email; we generate a synthetic
   one from the user ID so the unique-email DB constraint holds.
   Callback URL: [domain]/api/auth/callback/instagram
   Requires: Meta developer app with "Instagram Login" product.
   ─────────────────────────────────────────────────────────── */
const Instagram = {
  id: "instagram",
  name: "Instagram",
  type: "oauth" as const,
  clientId: process.env.AUTH_INSTAGRAM_ID!,
  clientSecret: process.env.AUTH_INSTAGRAM_SECRET!,
  authorization: {
    url: "https://api.instagram.com/oauth/authorize",
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

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Phase 2: Instagram OAuth (handle: ian_g477)
    // Uncomment when Meta developer app is approved:
    // Instagram,
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: string }).role ?? "user";
        session.user.bio = (user as { bio?: string }).bio ?? null;
      }
      return session;
    },
    async signIn({ user, profile }) {
      const isAdminEmail = user.email === process.env.ADMIN_EMAIL;
      // Phase 2: also grant admin to Instagram handle ian_g477
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
    };
  }
}
