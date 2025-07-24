const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) =>{
    const reducer = (sum, item) => {
        return sum+item.likes
    }
    return blogs.length===0
    ? 0
    : blogs.reduce(reducer,0) / blogs.length
}

const favoriteBlog = (blogs) => {
    const reducer = (max, post) => {
        return post.likes>max.likes 
        ? post
        : max
    }

    return blogs.length===0
    ? {}
    : blogs.reduce(reducer, blogs[0])
}

module.exports={
    dummy,
    totalLikes, 
    favoriteBlog
}