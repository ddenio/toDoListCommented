//creating variable to hold our import of the express.js framework into our project
const express = require('express')
//This line creates an instance of the express application, this 'app' object is what we use to configure routes, middleware, and other settings for the web app.
const app = express()
//this line imports the MongoDB Node.js Driver, specifically the MongoClient class, how we connect to a mongoDB database, perform CRUD operations, etc.
const MongoClient = require('mongodb').MongoClient
//setting our localhost port to port 2121
const PORT = 2121
//used to load our environment variables from our '.env' file into our 'process.env' object
require('dotenv').config()

//these next two code blocks connect us to our database, the dbConnectionStr holds our MongoDB connection link from our .env file
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

//the actual connecting to our MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })


//these lines of code configure various settings for our Express applicaiton
//this line sets the view engine for our express app to EJS, allows us to render EJS templates withotu specifing the file extension when we call 'res.render()'
app.set('view engine', 'ejs')
//this line sets up a middleware to serve static files from the 'public' file directory, gives access to CSS files and client-side JavaScript.
  // by using this middleware we can serve these files directly to clients without needing to handle them explicitly in our routes
app.use(express.static('public'))
//This line sets up middleware to parse URL-encoded request bodies. allows for comples objects and arrays to be encoded in the URL-encoded format.
app.use(express.urlencoded({ extended: true }))
//THis line sets up middleware to parse JSON-formatted request bodies,when the client sends data with a content type
// of 'application/json'this middleware parses the JSON data and makes it available in 'req.body'
app.use(express.json())

//our GET request API thats listens and then 'gets' or grab all items (documents) from our MongoDB database collection
//This can be triggered by manually refreshing our home page, or root page (/ path),
app.get('/',async (request, response)=>{
    //we connect to our datagbase (db), 'find' all of our documents (collection), or todos; which are each an object, and we then put them into an array
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    //once we grab all of our items from our database, we render them on our client side, added all todos, by plugging in
    // all collected information into our index.ejs template, and spitting(rendering) out HTML, and respond with this HTML, making it visible to the user
    //here we also named the collection of all our todo tasks 'items', as seen below
    response.render('index.ejs', { items: todoItems, left: itemsLeft })

    //the code below is the old way to do what we have done above

    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

//API, set up to hear POST request from Client-side index.ejs form submit
app.post('/addTodo', (request, response) => {
    //grabbing form value from our index.ejs (using 'request.body.todoItem') when from is submitted
    //once grabbed, we are adding the todo to our MongoDB database collection here!
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        //after our item is grabbed from our html form, and we have added item to our database,
        //we then RESPOND with: console.log('todo added), and refresh the page (which updates everything), which in turn sends a GET request (which we have setup above (app.get))
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

//our PUT (update) HTTP request.
app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})



app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})