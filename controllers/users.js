const User= require('../models/user')
const userRouter= require('express').Router()
const bcrypt= require('bcrypt')

userRouter.post('/', async (request, response) => {
    const {username, name, password } = request.body
    const minLength=3

    if (!password){
        return response.status(400).json({error: 'Please enter a non-empty password'})
    } else if (password.length<=minLength){
        return response.status(400).json({error: 'password should have atleast 4 characters'})
    }
    const saltRounds=10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user =  new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    return response.status(201).json(savedUser)
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({})

    response.json(users)
})

module.exports = userRouter