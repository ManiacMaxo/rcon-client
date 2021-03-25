import React, { FormEvent, useEffect, useState } from 'react'
import { Form, Input } from 'semantic-ui-react'
import { v4 } from 'uuid'
import Rcon, { RconOptions } from '../../lib/Rcon'

const Terminal = (props: RconOptions): JSX.Element => {
    const client = new Rcon(props.host, props.password, props.port)

    // prettier-ignore
    useEffect(() => {
        client.connect()

        client.on('response', (res) => {
            setLog((l) => [...l, res])
        })
    }, [])

    const [log, setLog] = useState<string[]>([])

    const handleCommand = async (
        e: FormEvent,
        { command }: { command: string }
    ) => {
        e.preventDefault()
        client.send(command)
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
