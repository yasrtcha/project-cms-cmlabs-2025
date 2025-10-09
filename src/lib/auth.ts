import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined

        if (!email || !password) {
          throw new Error("Email dan password harus diisi")
        }

        const user = await prisma.user.findUnique({
          where: {
            email: email
          }
        })

        if (!user || !user.password) {
          throw new Error("Email atau password salah")
        }

        const isPasswordCorrect = await bcrypt.compare(
          password,
          user.password
        )

        if (!isPasswordCorrect) {
          throw new Error("Email atau password salah")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
      }
      // Refresh user data from database when update is called
      if (trigger === "update") {
        const refreshedUser = await prisma.user.findUnique({
          where: { id: token.id as string }
        })
        if (refreshedUser) {
          token.name = refreshedUser.name
          token.email = refreshedUser.email
          token.picture = refreshedUser.image
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        // Fetch latest user data from database
        const user = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            company: true,
            jobTitle: true,
            country: true,
          }
        })
        if (user) {
          session.user.name = user.name || ""
          session.user.email = user.email || ""
          session.user.image = user.image || ""
          // Add additional fields to session
          ;(session.user as any).company = user.company
          ;(session.user as any).jobTitle = user.jobTitle
          ;(session.user as any).country = user.country
        }
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
})
