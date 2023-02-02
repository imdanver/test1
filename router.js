import express from 'express'
const router = express.Router()
const jsonParser = express.json()
import ajax from './handler.js'

router.post('/ajax', jsonParser, ajax)

export default router