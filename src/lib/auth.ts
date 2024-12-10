import NextAuth from "next-auth";
import Google from "next-auth/providers/google"

if (!process.env.AUTH_GOOGLE_ID || !process.env.AUTH_GOOGLE_SECRET) {
  console.error('Missing Google OAuth creds', process.env);
  process.exit(1);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  //adapter: MongoDBAdapter(mongoClient),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    })
  ]
})