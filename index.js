const express = require('express')

const app = express();

const cors = (req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','*');
  res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
  if (req.method === 'OPTIONS'){
    return res.status(200).end();
  }
  
  next();

}
app.use(cors);

app.use(express.json());


let movieIdCounter=4;

let movies = [
  {
    id: 1,
    title: "Inception",
    description: "A skilled thief steals secrets from dreams.",
    types: ["Sci-Fi"],
    averageRating: 2,
    reviews: [
      { id: 1, content: "Amazing movie!", rating: 5 },
      { id: 2, content: "Great visuals.", rating: 4 }
    ]
  },
  {
    id: 2,
    title: "Inception333",
    description: "A skilled thief steals secrets from dreams.",
    types: ["Sci-Fi"],
    averageRating: 3,
    reviews: [
      { id: 1, content: "Amazing movie!", rating: 5 },
      { id: 2, content: "Great visuals.", rating: 4 }
    ]
  },

  {
    id: 3,
    title: "avenger",
    description: "it is important to communicate with others",
    types: ["Sci-Fi"],
    averageRating: 4,
    reviews: [
      { id: 1, content: "Amazing movie!", rating: 5 },
      { id: 2, content: "Great visuals.", rating: 4 }
    ]
  }
];

movieExist = (movie)=>{
  
  if (!movie){
    return {message:"no movie found"}
  }
  return movie;

}

getMovieById=(id)=>{
  const movie= movies.find((movie)=>movie.id===parseInt(id));
  return movieExist(movie);
 
}
app.get('/v1/movies',(req,res)=>{
  const {keyword,pageSize,page,sort}=req.query;

  if(keyword){
    const movie= movies.filter((m)=>m.title.toLowerCase().includes(keyword.toLowerCase()))
    const result=movieExist(movie);

    if (result.message){
      return res.status(404).json(result);
    }
    return res.status(200).json(result)

  }

  if(sort=="rating"){
   const sortMovies=movies.sort((a,b)=>b.averageRating - a.averageRating)
   return res.status(200).json(sortMovies)
  }
  else if (sort=="-rating"){
   const sortMovies= movies.sort((a,b)=>a.averageRating - b.averageRating)
   return res.status(200).json(sortMovies)
    
  }


  if (!movies){
    return res.status(404).json({error:'not movies exist'})
  }

  res.status(200).json(movies);
  
})

app.get('/v1/movies/:id', (req,res)=>{
  const {id}= req.params;
  const result = getMovieById(id);
  if(result.message){
    return res.status(404).json(result)
  }

  res.status(200).json(result);
}
)

app.post('/v1/movies',(req,res)=>{
  const {title, description, types} = req.body;
  if(!title || ! description || !Array.isArray(types) || types.length===0){
    return res.status(400).json({error:'title, description and types are all required'})
  }

  const newMovie= {
    id: movieIdCounter++,
    title,
    description,
    types,
    averageRating:0,
    reviews: []
  }
  movies.push(newMovie);
  res.status(201).json({message:"movie create success", movie:newMovie})

})

app.delete('/v1/movies/:id',(req,res)=>{
  const {id}=req.params;
  const movieIndex= movies.findIndex((m)=>m.id===parseInt(id));
  if(movieIndex===-1){
    return res.status(404).json("no movie found")
  }
  movies.splice(movieIndex,1)   //delete 1 item from the index of movieIndex
  // const newMovies= movies.filter((m)=>m.id !== parseInt(id))
  res.status(204).json({message:"delete success", movies:movies})//204会no content， 200才会有json

})

app.put('/v1/movies/:id',(req,res)=>{
  const {id}=req.params;
  const {title, description, types} = req.body;
  const movie=getMovieById(id);
  if(movie.message){
    return res.status(404).json(movie)
  }
  if((!title && !description && !types) || 
  (types && !Array.isArray(types)))
  {
    return res.status(400).json("invalid data input")
  }
  
  if(title) movie.title=title
  if(description) movie.description=description
  if(types) movie.types=types

  res.status(200).json({message:"update successfully", movie:movie})
})



app.listen(3000,()=>{
  console.log(`Server is running on http://localhost:3000`);
})