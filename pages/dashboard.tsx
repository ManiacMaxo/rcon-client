import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { Button, Form, Input } from 'semantic-ui-react'
import { Layout, Terminal } from '../components'
import { io } from 'socket.io-client'

const socket = io({ reconnectionAttempts: 10 })

const dashboard = (): JSX.Element => {
    const [host, setHost] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [port, setPort] = useState<number>(25575)
    const [connected, setConnected] = useState<boolean>(false)

    useEffect(() => {
        setHost(window.localStorage.getItem('host') ?? '')

        socket.onAny(console.log)

        socket.on('serverConnectError', () => {
            setConnected(false)
            console.log('connection error')
        })

        socket.on('serverConnectSuccess', () => {
            setConnected(true)
        })
    }, [])

    return (
        <Layout>
            <Head>
                <title>RCON Dashboard</title>
            </Head>
            {connected ? (
                <Terminal socket={socket} />
            ) : (
                <Form
                    onSubmit={(e) => {
                        e.preventDefault()
                        socket.emit('serverConnect', { host, password, port })
                    }}
                >
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
                    <Button type='submit' primary>
                        Connect
                    </Button>
                </Form>
            )}
        </Layout>
    )
}

export default dashboard
