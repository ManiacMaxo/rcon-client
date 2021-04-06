require('dotenv').config()

const { createServer } = require('http')
const next = require('next')
const io = require('socket.io')()
const { Rcon } = require('./Rcon')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
    const server = createServer((req, res) => {
        const parsedUrl = new URL(req.url, process.env.NEXTAUTH_URL)
        if (!parsedUrl.pathname.startsWith('/_next/')) {
            console.log(`[${req.method}] ${parsedUrl.pathname}`)
        }
        handle(req, res, parsedUrl)
    })

    io.attach(server, {
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: !dev
    })

    io.on('connection', (socket) => {
        const rcon = new Rcon()

        rcon.on('response', (data) => socket.emit('response', data))
        rcon.on('server', (data) => socket.emit('server', data))
        rcon.on('error', (err) => socket.emit('error', err))

        rcon.once('connect', () => console.log('connected'))
        rcon.once('auth', () => {
            console.log('auth')
            socket.emit('serverConnectSuccess')
        })

        socket.once('serverConnect', ({ host, password, port }) => {
            rcon.init(host, password, port).connect()
        })

        socket.onAny((event, data) => {
            console.log(event, data)
        })
    })

    const port = process.env.PORT ?? 3000
    server.listen(port)
    console.log(`listening on http://localhost:${port}`)
})
