import { EventEmitter } from 'events'
import { createConnection, Socket } from 'net'

const PacketType = {
    COMMAND: 0x02,
    AUTH: 0x03,
    RESPONSE_VALUE: 0x00,
    RESPONSE_AUTH: 0x02
}

export interface RconOptions {
    host: string
    password: string
    port: number
}

class Rcon extends EventEmitter {
    private id = 0x0012d4a6
    private authorized = false
    private socket: Socket
    private outstandingData = null

    constructor(
        private host: string,
        private password: string,
        private port?: number
    ) {
        super()
        this.port = port ?? 25575
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    send(data: any, command?: number, id?: number): void {
        console.log(command)
        command = command ?? PacketType.COMMAND
        id = id ?? this.id
        const length = Buffer.byteLength(data)
        const sendBuf = Buffer.alloc(length + 14)
        sendBuf.writeInt32LE(length + 10, 0)
        sendBuf.writeInt32LE(id, 4)
        sendBuf.writeInt32LE(command, 8)
        sendBuf.write(data, 12)
        sendBuf.writeInt16LE(0, length + 12)
    }

    _sendSocket(buffer: Buffer): void {
        this.socket.write(buffer.toString('binary'), 'binary')
    }

    connect(): void {
        this.socket = createConnection({ port: this.port, host: this.host })

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        this.socket
            .on('connect', () => {
                self.emit('connect')
                self.send(this.password, PacketType.AUTH)
            })
            .on('data', (data) => {
                self._socketOnData(data)
            })
            .on('error', (err) => {
                self.emit('error', err)
            })
            .on('end', () => {
                self.emit('end')
            })
    }

    _socketOnData(data: Buffer): void {
        if (this.outstandingData != null) {
            data = Buffer.concat(
                [this.outstandingData, data],
                this.outstandingData.length + data.length
            )
            this.outstandingData = null
        }

        while (data.length) {
            const len = data.readInt32LE(0)
            if (!len) return

            const id = data.readInt32LE(4)
            const type = data.readInt32LE(8)

            if (len >= 10 && data.length >= len + 4) {
                if (id == this.id) {
                    if (!this.authorized && type == PacketType.RESPONSE_AUTH) {
                        this.authorized = true
                        this.emit('auth')
                    } else if (type == PacketType.RESPONSE_VALUE) {
                        // Read just the body of the packet (truncate the last null byte)
                        // See https://developer.valvesoftware.com/wiki/Source_RCON_Protocol for details
                        let str = data.toString('utf8', 12, 12 + len - 10)

                        if (str.charAt(str.length - 1) === '\n') {
                            // Emit the response without the newline.
                            str = str.substring(0, str.length - 1)
                        }

                        this.emit('response', str)
                    }
                } else if (id == -1) {
                    this.emit('error', new Error('Authentication failed'))
                } else {
                    // ping/pong likely
                    let str = data.toString('utf8', 12, 12 + len - 10)

                    if (str.charAt(str.length - 1) === '\n') {
                        // Emit the response without the newline.
                        str = str.substring(0, str.length - 1)
                    }

                    this.emit('server', str)
                }

                data = data.slice(12 + len - 8)
            } else {
                // Keep a reference to the chunk if it doesn't represent a full packet
                this.outstandingData = data
                break
            }
        }
    }

    setTimeout(timeout: number, callback?: () => void): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        this.socket.setTimeout(timeout, () => {
            self.socket.end()
            if (callback) callback()
        })
    }

    disconnect(): void {
        this.socket.end()
        this.authorized = false
    }
}

export default Rcon
