import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_ID ?? '',
            clientSecret: process.env.GITHUB_SECRET ?? ''
        }),
        Providers.Discord({
            clientId: process.env.DISCORD_CLIENT_ID ?? '',
            clientSecret: process.env.DISCORD_CLIENT_SECRET ?? ''
        })
    ],

    secret: process.env.SECRET,
    // jwt: {
    //     signingKey: process.env.JWT_SIGNING_PRIVATE_KEY
    // },
    pages: {
        signIn: '/auth/signin'
    },
    callbacks: {
        async redirect(url, baseUrl) {
            return baseUrl
        }
    }
})
