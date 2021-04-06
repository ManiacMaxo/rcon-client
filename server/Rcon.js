const { EventEmitter } = require('events')
const { createConnection } = require('net')

const PacketType = {
    COMMAND: 0x02,
    AUTH: 0x03,
    RESPONSE_VALUE: 0x00,
    RESPONSE_AUTH: 0x02
}

class Rcon extends EventEmitter {
    static id = 0x0012d4a6

    constuctor() {
        this.super()
    }

    init(host, password, port) {
        this.authorized = false
        this.socket
        this.outstandingData = null
        this.host = host
        this.password = password
        this.port = port ?? 25575

        return this
    }

    send(data, command, id) {
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

    _sendSocket(buffer) {
        this.socket.write(buffer.toString('binary'), 'binary')
    }

    connect() {
        this.socket = createConnection({ port: this.port, host: this.host })

        this.socket
            .on('connect', () => {
                this.emit('connect')
                this.send(this.password, PacketType.AUTH)
            })
            .on('data', (data) => {
                this._socketOnData(data)
            })
            .on('error', (err) => {
                this.emit('error', err)
            })
            .on('end', () => {
                this.emit('end')
            })
    }

    _socketOnData(data) {
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

    setTimeout(timeout, callback) {
        this.socket.setTimeout(timeout, () => {
            this.socket.end()
            if (callback) callback()
        })
    }

    disconnect() {
        this.socket.end()
        this.authorized = false
    }
}

module.exports = { Rcon }
