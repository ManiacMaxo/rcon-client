import React, { FormEvent, useEffect, useState } from 'react'
import { Form, Input } from 'semantic-ui-react'
import { Socket } from 'socket.io-client'
import { v4 } from 'uuid'

const Terminal = (props: { socket: Socket }): JSX.Element => {
    const [log, setLog] = useState<string[]>([])

    useEffect(() => {
        props.socket.onAny((e, d) => console.log(e, d))

        props.socket.on('response', (res) => {
            setLog((l) => [...l, res])
        })
    }, [])

    const handleCommand = async (
        e: FormEvent,
        { command }: { command: string }
    ) => {
        e.preventDefault()
        props.socket.emit('command', command)
        setLog((l) => [...l, command])
    }

    return (
        <div>
            <div>
                {log.map((message) => (
                    <span key={v4()}>{message}</span>
                ))}
            </div>
            <Form onSubmit={handleCommand}>
                <Input />
            </Form>
        </div>
    )
}

export default Terminal
