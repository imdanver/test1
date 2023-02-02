import express from 'express'
const app = express()
import bodyParser from 'body-parser'
import cors from 'cors'
import router from './router.js'
import multer from 'multer'

const storageConfig = multer.memoryStorage()
app.use(multer({storage: storageConfig}).single('file'))

app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '5mb',
    extended: true
}))

app.use(bodyParser.urlencoded({extended: true}))

app.use(cors())
app.use(router)

app.use('/', express.static('client/dist'))
app.use(express.static('uploads'))

export default app
