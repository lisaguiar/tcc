import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'; 
import { createServer } from 'http'
import { Server } from 'socket.io'
import { decodedToken } from './middleware/token.js'
import authRoutes from './routes/authRoute.js'
import noteRoutes from './routes/annotationRoute.js'
import userRoutes from './routes/userRoute.js'
import desktopRoutes from './routes/desktopRoute.js'
import projectRoutes from './routes/projectRoute.js'
import frameRoutes from './routes/frameRoute.js'
import kanbanRoutes from './routes/kanbanRoute.js'
import checklistRoutes from './routes/checklistRoute.js'
import annotationRoutes from './routes/annotationRoute.js'
import priorityRoutes from './routes/priorityRoute.js'
import favoriteRoutes from './routes/favoriteRoute.js'
import memberRoutes from './routes/memberRoute.js'
import modelRoutes from './routes/modelRoute.js'
import notificationRoutes from './routes/notificationRoute.js'

dotenv.config({ path: "./config/.env"})

const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ["GET", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept"],
        credentials: true
    },
    allowEIO3: true
});

app.use(cors({ 
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin, X-Requested-With, Content-Type, Accept"],
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.use((req, res, next) => {
    req.io = io
    const token = req.cookies.token

    handleSocketConnection(req.io, token)
    next()
})

function handleSocketConnection(io, token) {
    io.on('connection', (socket) => {
        const decoded = token && decodedToken(token)

        if (!token || !decoded) {
            console.log("Conexão falhou.")
            socket.disconnect(true)
            return res.status(400).json({ error: "Conexão falhou." })
        }
        socket.on('disconnect', () => {
            return res.status(200).json({ message: "Usuário desconectado." })
        })
    })
}

app.use('/api', authRoutes)
app.use('/api/note', noteRoutes)
app.use('/api/user', userRoutes)
app.use('/api/desktops', desktopRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/frames', frameRoutes)
app.use('/api/kanban', kanbanRoutes)
app.use('/api/checklist', checklistRoutes)
app.use('/api/annotation', annotationRoutes)
app.use('/api/priority', priorityRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/notification', notificationRoutes)
app.use('/api/models', modelRoutes)

const PORT = process.env.PORT || 8000

server.listen(PORT, () => {
    console.log(`Conectado na porta ${PORT}.`)
})