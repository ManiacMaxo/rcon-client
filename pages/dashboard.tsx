import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'
import { Layout, Terminal } from '../components'
import { RconOptions } from '../lib/Rcon'

const dashboard = (): JSX.Element => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [options, setOptions] = useState<RconOptions>()
    const [host, setHost] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [port, setPort] = useState<number>(25575)

    useEffect(() => {
        setHost(window.localStorage.getItem('host') ?? '')
    }, [])

    return (
        <Layout>
            <Head>
                <title>RCON Dashboard</title>
            </Head>
            {options ? (
                <Terminal {...options} />
            ) : (
                <Form>
                    <Form.Field
                        control={Input}
                        label='Host'
                        placeholder='Host'
                        value={host}
                        onChange={({ target }) => {
                            window.localStorage.setItem('host', target.value)
                            setHost(target.value)
                        }}
                    />
                    <Form.Field
                        control={Input}
                        type='password'
                        label='Password'
                        placeholder='Password'
                        value={password}
                        onChange={({ target }) => setPassword(target.value)}
                    />
                    <Form.Field
                        control={Input}
                        type='number'
                        label='Port'
                        placeholder='Port'
                        max={65535}
                        value={port}
                        onChange={({ target }) => setPort(target.value)}
                    />
                    <Button
                        type='submit'
                        primary
                        onClick={(e) => {
                            e.preventDefault()
                            setOptions({ host, password, port })
                        }}
                    >
                        Connect
                    </Button>
                </Form>
            )}
        </Layout>
    )
}

export default dashboard
