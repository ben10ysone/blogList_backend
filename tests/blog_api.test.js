const mongoose = require('mongoose')
const app=require('../app')
const { test, after, beforeEach } =  require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const Blog = require('../models/blog')

const api = supertest(app)

let initialBLogs=[
    {
        'title': 'my first blog',
        'author': 'arnav',
        'url': 'https://ahahahaa',
        'likes': 450,
    },
    {
        'title': 'my second blog',
        'author': 'arnav',
        'url': 'https://ahahaa',
        'likes': 40,
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    let blog1=new Blog(initialBLogs[0])
    await blog1.save()
    let blog2=new Blog(initialBLogs[1])
    await blog2.save()
})


test('app sends all the required notes', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-type', /application\/json/)
})

test('db returns correct number of blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBLogs.length)
})

test('blog has property id', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body[0].hasOwnProperty('id'), true)
})

test('correct blog is posted', async () => {
    const newBlog= {
        'title': 'my third blog',
        'author': 'arnav',
        'url': 'https://ahah',
        'likes': 700, 
    }

    const savedBlog = await api.post('/api/blogs')
                        .send(newBlog)
                        .expect(201)
                        .expect('Content-type', /application\/json/)

    const finalBlogs = await api.get('/api/blogs')
    assert.strictEqual(finalBlogs.body.length, initialBLogs.length+1)
    assert.strictEqual(savedBlog.body.title, newBlog.title)
    assert.strictEqual(savedBlog.body.author, newBlog.author)
    assert.strictEqual(savedBlog.body.url, newBlog.url)
    assert.strictEqual(savedBlog.body.likes, newBlog.likes)
})

test('without like property likes is 0', async () => {
    const newBlog= {
        'title': 'my extra blog',
        'author': 'arnav',
        'url': 'https://aah',
    }
    const savedBlog = await api.post('/api/blogs')
                        .send(newBlog)
                        .expect(201)
                        .expect('Content-type', /application\/json/)
    assert.strictEqual(savedBlog.body.likes,0)
})

test('checking for title present or not works', async () => {
    const blogTitle= {
        'author': 'arnav',
        'url': 'https://aah',
        'likes': 400,
    }
    await api.post('/api/blogs')
        .send(blogTitle)
        .expect(400)

    const blogUrl= {
        'title': 'ispresent',
        'author': 'arnav',
        'likes': 400,
    }
    await api.post('/api/blogs')
        .send(blogUrl)
        .expect(400)

    const blogBoth= {
        'author': 'arnav',
        'likes': 400,
    }
    await api.post('/api/blogs')
        .send(blogBoth)
        .expect(400)

})

test.only("deletion of blog works", async () => {
    const blogsAtStart = await api.get('/api/blogs')
    console.log(blogsAtStart.body)
    const blogToDelete=blogsAtStart.body[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd=await api.get('/api/blogs')
    assert.strictEqual(blogsAtStart.body.length-1, blogsAtEnd.body.length)
}) 


after(async () => {
    mongoose.connection.close()
})