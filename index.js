import * as dotenv from 'dotenv'
dotenv.config()

import app from './app.js'

import Messages from "./messages.js"
new Messages()

const port = process.env.SERVER_PORT
app.listen(port, () => {console.log(`Server working on port ${port}`)})
