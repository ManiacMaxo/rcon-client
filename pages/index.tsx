import { signIn, signOut, useSession } from 'next-auth/client'
import Head from 'next/head'
import React from 'react'
import { Button } from 'semantic-ui-react'
import Layout from '../components/Layout'

export const Home = (): JSX.Element => {
    const [session] = useSession()

    return (
        <Layout>
            <Head>
                <title>RCON</title>
            </Head>
            {session ? (
                <div>
                    Hello <strong>{session.user.email}</strong>
                    <br />
                    <Button onClick={() => signOut()}>Sign out</Button>
                </div>
            ) : (
                <div>
                    <h1>You are not signed in</h1>
                    <Button onClick={() => signIn()}>Sign in</Button>
                </div>
            )}
        </Layout>
    )
}

export default Home
