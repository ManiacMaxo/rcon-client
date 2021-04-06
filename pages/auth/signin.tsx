import { providers as authProviders, signIn } from 'next-auth/client'
import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic'
import { Layout } from '../../components'

interface Provider {
    name: string
    id: string
    callbackUrl: string
    signinUrl: string
    type: string
    color: string
    icon: SemanticICONS
}

const signin = ({ providers }: { providers: Provider[] }): JSX.Element => {
    return (
        <Layout>
            {Object.values(providers).map((provider) => (
                <Button
                    icon
                    labelPosition='left'
                    onClick={() => signIn(provider.id)}
                    // style={{ backgroundColor: provider.color }}
                    color='black'
                    key={provider.name}
                >
                    <Icon name={provider.icon} size='large' />
                    Sign in with {provider.name}
                </Button>
            ))}
        </Layout>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getServerSideProps = async (context) => {
    const providers = await authProviders()
    Object.values(providers).map((provider: any) =>
        Object.assign(provider, {
            icon: provider.name.toLowerCase(),
            color: 'black'
        })
    )

    return {
        props: { providers }
    }
}

export default signin
