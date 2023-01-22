import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import { setupRouter } from './routes'
import { databaseConnection } from './utils/database'

const app = express()
const port = process.env.PORT || 4001

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({ origin: process.env.ORIGIN }))
app.use(helmet())
app.use(mongoSanitize())

databaseConnection()
setupRouter(app)

app.listen(port, () => console.log('App running..'))