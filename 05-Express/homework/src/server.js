// const bodyParser = require("body-parser");
const express = require("express");

const STATUS_USER_ERROR = 422;

// This array of posts persists in memory across requests. Feel free
// to change this to a let binding if you need to reassign it.
let posts = [];

const server = express();
// to enable parsing of json bodies for post requests
 server.use(express.json());
const PATH ='/posts';
let id=1;
server.post(PATH,(req, res)=>{
    const {author, title, contents} = req.body;
    if (!author || !title || !contents){
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
    }
    const post = {
        author, title,contents, id:id++
    };
    posts.push(post);
    res.status(200).json(post)
});
    
server.post(`${PATH}/author/:author` ,(req, res)=>{
    const {title, contents} = req.body;
    const {author}= req.params 
    if (!author || !title || !contents){
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para crear el Post"})
    }
    const post = {
        author, title,contents, id:id++
    };
    posts.push(post);
    res.status(200).json(post)
});
server.get(PATH, (req, res)=>{
    const {term}=req.query;
    if(!term){
        return res.status(200).json(posts);
    }else{
        const postvalid = posts.filter((post)=>post.title.includes(term) || post.contents.includes(term)  )
    res.status(200).json(postvalid);
 }
 

})
server.get("/posts/:author", (req, res)=>{
    let {author} =req.params;
    const validpost = posts.filter((post)=> post.author === author)
    if (validpost.length === 0 ){
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post del autor indicado"})
    }else{
        return res.status(200).json(validpost);
    }
  
})
server.get("/posts/:author/:title", (req, res)=>{
    const {author, title}= req.params
    const validtitulo = posts.filter((post)=> post.title === title && post.author === author)
    if(validtitulo.length === 0 ){
        return res.status(STATUS_USER_ERROR).json({error: "No existe ningun post con dicho titulo y autor indicado"})
    }else{
        return res.status(200).json(validtitulo);
    }
})
server.put("/posts", (req,res)=>{
    const {id, title,contents} =req.body
     if( !id || !title ||  !contents){
        return res.status(STATUS_USER_ERROR).json({error: "No se recibieron los parámetros necesarios para modificar el Post"})
    }
    const idvalido = posts.find((post) => post.id === id)
    if(idvalido){
        idvalido.title = title
        idvalido.contents=contents
        return res.status(200).json(idvalido);
    }
    else{
        return res.status(422).json({error:"chupalagato"})
    }
 
})
server.delete("/posts", (req,res)=>{
const {id} =req.body
if(!id){
    return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"})  
}
const iddeleteado =posts.find((post)=>post.id === id)
if(iddeleteado){
posts = posts.filter((post)=> post.id !== id )
return res.status(200).json({ success: true })
} else{
    return res.status(422).json ({error:"chupalagato"})
}


})
server.delete ("/author", (req,res)=>{
    const {author} =req.body
if(!author){
    return res.status(STATUS_USER_ERROR).json({error: "Mensaje de error"})  
}
const authordeleteado =posts.find((post)=>post.author === author)
if(authordeleteado){
    const authordeleteadosputos = posts.filter((post)=> post.author === author )
posts = posts.filter((post)=> post.author !== author )
return res.status(200).json(authordeleteadosputos)
} else{
    return res.status(422).json ({error:"No existe el autor indicado"})
}
})
// TODO: your code to handle requests


module.exports = { posts, server };
