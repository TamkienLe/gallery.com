//Create express app
const express = require('express');
const session = require('express-session');
let app = express();
const path = require('path');

//Database variables
let mongo = require('mongodb');
var ObjectId = require('mongodb').ObjectID;

const pug = require("pug");
let MongoClient = mongo.MongoClient;
let db;



const ROOT_DIR_JS = '/public'



app.set("view engine", "pug");

const viewspath = path.join(__dirname, "views");
app.set("views", viewspath);
app.use(express.static(__dirname + ROOT_DIR_JS)); 
app.use(express.urlencoded({ extended: true }));

app.use(session({ 
	secret: 'some secret here', 
	//cookie: {maxAge:50000},  //the cookie will expire in 50 seconds
	resave: true,
	saveUninitialized: true
  }));  // now we have req.session object


//create array for username and password
let users = [];
let followedArtists = [];
let followedArtist = [];
let reviews = [];
let username;
let password;





app.get('/client.js', (req, res)=>{
  res.sendFile(__dirname + '/public/client.js')
})


//render style.cs
app.get('/styles.css', (req, res)=>{
  res.sendFile('styles.css')

})



//post requests
app.post("/login", login);  
app.post("/logout", logout);
app.post("/addArt", addArt);


//register
app.get('/', (req, res)=>{
	res.render('register', {})
  db.collection('users').find().toArray((err, result)=>{
    if(err) return console.log(err)
    for(let i = 0; i < result.length; i++){
      db.collection('users').updateOne({_id: result[i]._id}, {$set: {reviews: []}})
    }
  })


  
})


//register page
app.post('/register', (req, res)=>{
    
  //parse the body of the request and print
  req.on('data', (data)=>{

      let user = JSON.parse(data);
      //if username is alraedy in array, send error message
      if(users.includes(user.username)){
          res.send("Username already exists");
      }
      //if username is not in array, add username and password to array
      else{
          users.push(user.username);
          users.push(user.password);
          users.push(user.accountType)
          res.send("Account Registered");
          console.log(users);
      }
  }

  )
})  

//login page
app.get('/login', (req, res)=>{
  res.render('login', {})
})


//addArt to mongoDB database
function addArt(req, res){
  let name = req.body.name;
  let year = req.body.year;
  let category = req.body.category;
  let medium = req.body.medium;
  let description = req.body.description;
  let image = req.body.image;
  let artId = Math.floor(Math.random() * 1000000000);

  //create object for art
  let art = {_id: artId,name: name,artist:username,year: year, category: category, medium: medium, description: description, image: image};


  //insert art into end of database but if name is already in database send error message
  //loop through database and check if name is already in database
  db.collection('users').find().toArray((err, result)=>{
    if(err) return console.log(err)
    for(let i = 0; i < result.length; i++){
      if(result[i].name == name){
        return;
  
      }
    }

  } )


  //if name is not in database, insert art into database
  db.collection('users').insertOne(art, (err, result)=>{
    console.log('saved to database')


 

  res.redirect('/artists')
  })
  

}


//add art prompt
app.post('/addArtPrompt', (req, res)=>{
  req.on('data', (data)=>{

    let art = JSON.parse(data);
    
    //get name of art
    let name = art.name;
    let year = art.year;
    let category = art.category;
    let medium = art.medium;
    let description = art.description;
    let image = art.image;
    let artId = Math.floor(Math.random() * 1000000000);

    //create object for art
    art = {_id: artId,name: name,artist:username,year: year, category: category, medium: medium, description: description, image: image};

    //add art to database
    db.collection('users').insertOne(art, (err, result)=>{
      console.log('saved to database')
    })
    

  
})

  


})

app.post('/like/:id', (req, res)=>{


})


//function for login auth
function login(req, res, next) {
	if (req.session.loggedin == true && req.session.username == req.body.username) {
		res.status(200).send("Already logged in.");
    req.session.loggedin = false;
		return;
	}

	username = req.body.username;
	password = req.body.password;

	console.log("Logging in with credentials:");
	console.log("Username: " + req.body.username);
	console.log("Password: " + req.body.password);

  if(!users.includes(username)){
    //if username is not in array alert user
    res.status(401).send("Account does not exist");
    
  }
    //if username is in array, check if password is in array
  if(users.includes(username) && users.includes(password)){
    req.session.loggedin = true;
    req.session.username = username;
    res.render('homepage')
  
  }
  



}

//logout function
function logout(req, res, next) {
  //if user refreshes page, they will be logged out

	if (req.session.loggedin) {
		req.session.loggedin = false;
		req.session.username = undefined;
		//render login page
    res.render('login')
	} 
  
  else {
		res.status(200).send("You cannot log out because you aren't logged in.");
	}
}


	

app.get('/homepage', (req, res)=>{
  //send in users from database
  db.collection('users').find().toArray((err, result)=>{
    if(err) return console.log(err)
    for(let i = 0; i < result.length; i++){
      db.collection('users').updateOne({_id: result[i]._id}, {$set: {reviews: []}})
    }
  


    res.render('homepage', {users: result})
  })
})



//patron info
app.get('/userInfo', (req, res)=>{
  //go through database and send back everything that matches the followedArtist
  console.log(followedArtist)
  //get reviews from database
  db.collection('users').find().toArray((err, result)=>{
    if(err) return console.log(err)

    
    //get review array from database
    let reviews = [];
    for(let i = 0; i < result.length; i++){
      reviews.push(result[i].reviews)
    }
  


  })

  console.log(reviews)
  res.render('userInfo', {username: username, password: password, followedArtist: followedArtists, reviews: reviews})
    

 
  
})


//artist info
app.get('/artist', (req, res)=>{
 
  db.collection('users').find().toArray((err, result)=>{
    if(err) return console.log(err)

    //create reviews array
    //add reviews to array
    let reviews = [];
    for(let i = 0; i < result.length; i++){
        reviews.push(result[i].reviews)
    }


  })
  
  res.render('artist', {username:username,password: password, followedArtist: followedArtists, reviews: reviews})


})

//send users to client
app.get('/sendUsers',(req, res)=>{
  //send the array of users to the client
  res.send(users);
})


//adds category and medium links
app.get('/artists', (req, res)=>{
  //get the artist names from the database
  db.collection('users').find().toArray((err, result)=>{

    //check if there are duplicate categories
    let categories = [];
    for(let i = 0; i < result.length; i++){
      if(!categories.includes(result[i].category)){
        categories.push(result[i].category);
      }
    }
    //create medium array
    let mediums = [];
    for(let i = 0; i < result.length; i++){
      if(!mediums.includes(result[i].medium)){
        mediums.push(result[i].medium);
        
      }
    }




    //send result, categories, and mediums to the client
    res.render('artists', {artists: result, categories: categories, medium: mediums})

  })

})

app.get('/addArtist', (req, res)=>{
  //render the addArtist page
  res.render('addArt', {})
})



//get request artist _id
app.get('/artists/:id', (req, res)=>{
  //get current id from the database
  db.collection('users').find().toArray((err, result)=>{
    if(err) return console.log(err)

    //get the current id
    let currentId = req.params.id

    for(let i = 0; i < result.length; i++){
      if(result[i]._id == currentId){
        //create array for reviews
        let reviews = [];
        reviews.push(result[i].reviews)
        res.render('artistInfo', {artist: result[i], reviews: reviews})

      }

  }


})
})

app.post('/followArtist/:id', (req, res)=>{
  //get current id from the database
  db.collection('users').find().toArray((err, result)=>{
    if(err) return console.log(err)

    //get the current id
    let currentId = req.params.id

    //loop through the database to find the current id
    for(let i = 0; i < result.length; i++){
      if(result[i]._id == currentId){
        // if the user is not following the artist, add the artist to the user's following array
        if(!followedArtists.includes(result[i].name)){
          followedArtists.push(result[i])
        }
        

      }

    }

  })

})

app.post('/unfollowArtist/:id', (req, res)=>{
  //remove the artist from the followedArtist array
  followedArtists.splice(followedArtists.indexOf(req.params.id), 1)
})

app.post('/review/:id', (req, res)=>{
  //add the review to the database
  db.collection('users').find().toArray((err, result)=>{
    //get the current id
    let currentId = req.params.id

    let review = req.body.review


    //add the review to the reviews array in the database
    db.collection('users').updateOne({_id: ObjectId(currentId)}, {$push: {reviews: review}}, (err, result)=>{
      if(err) return console.log(err)
      console.log('saved to database')
    }
    )
    

    
   
      
 })
})
    


app.get('/artistCategory/:category', (req, res)=>{
  //query the database for the category
  db.collection('users').find().toArray((err, result)=>{

    //get current category
    let currentCategory = req.params.category

    //loop through and find all the artists in the current category
    let currentCategoryArray = [];
    for(let i = 0; i < result.length; i++){
      if(result[i].category == currentCategory){
        currentCategoryArray.push(result[i])
      }
    }
    //send result, categories, and mediums to the client
    res.render('artistCategory', {artists: currentCategoryArray, category: currentCategory})

  

})

})

app.get('/artistMedium/:medium', (req, res)=>{

  //query the database for the medium
  db.collection('users').find().toArray((err, result)=>{

    //get current medium
    let currentMedium = req.params.medium

    //loop through and find all the artists in the current medium
    let currentMediumArray = [];
    for(let i = 0; i < result.length; i++){
      if(result[i].medium == currentMedium){
        currentMediumArray.push(result[i])
      }
    }
    //send result, categories, and mediums to the client
    res.render('artistMedium', {artists: currentMediumArray, medium: currentMedium})
})

})








//connect to DB
MongoClient.connect("mongodb://127.0.0.1:27017/", { useNewUrlParser: true }, function(err, client) {
  if(err) throw err;
  db = client.db('collection');
  app.listen(3000);
  console.log("Listening on port http://localhost:3000/");
});
