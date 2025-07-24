const express = require('express')
const mongoose = require('mongoose')
const logger=require('./utils/logger')
const blogRouter=require('./controllers/blogs')
const config=require('./utils/config')

const app = express()

logger.info('connecting to', config.MONGODB_URI)

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl).then(()=>{
  logger.info('connected to mongoDB')
})
.catch(error=>{
  logger.error(`Error in connecting to mongoDB ${error}`)
})

app.use(express.json())

app.use('/api/blogs', blogRouter)

module.exports=app