import { db } from "@/lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { nanoid } from "nanoid";
import { NextAuthOptions, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.username = token.username;
      }

      return session;
    },

    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user!.id;
        return token;
      }

      if (!dbUser.username) {
        await db.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            username: nanoid(10),
          },
        });
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
        username: dbUser.username,
      };
    },
    redirect() {
      return "/";
    },
  },
};
export const getAuthSession = () => getServerSession(authOptions);
/* {"id":"0vxbo8jrqzlm","type":"CurrentUser","display_name":"Sai Suhas Sawant","name":"Sai Suhas Sawant","email":"saisawant2003@gmail.com","unconfirmed_email":null,"avatar_url":"https://app.planetscale.com/gravatar-fallback.png","created_at":"2023-06-21T14:03:39.579Z","updated_at":"2023-06-21T14:03:51.522Z","flags":{"data_imports":"full","deployment_revert_beta":"full","insights_tablet_type":"full"},"two_factor_auth_required":false,"two_factor_auth_configured":false,"session_expires_at":null,"session_refresh_url":null,"email_verified":false,"staff":false,"oauth":true,"sso":false,"managed":true,"directory_managed":false,"authenticated_cli":false,"tos":true,"read_only":false,"has_oauth_tokens":false} */
