import NextAuth, { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import clientPromise from '@/lib/mongodb-client'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Add user id to session
      if (session.user) {
        session.user.id = user.id
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    newUser: '/profile-setup', // Redirect new users to profile setup
    error: '/auth/error', // Error page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug logs
  // This ensures the correct URL is used in production
  ...(process.env.NEXTAUTH_URL && { url: process.env.NEXTAUTH_URL }),
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
