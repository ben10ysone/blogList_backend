const express = require('express')
const mongoose = require('mongoose')
const logger=require('./utils/logger')
const blogRouter=require('./controllers/blogs')
const config=require('./utils/config')
const middleware = require('./utils/middleware')
const userRouter =  require('./controllers/users')
const loginRouter = require('./controllers/login')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI).then(()=>{
  logger.info('connected to mongoDB')
})
.catch(error=>{
  logger.error(`Error in connecting to mongoDB ${error}`)
})

app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports=app