// ==============FOR API==============
var express = require('express')
var app = express()
var port = 2019

// for JSON format - supaya express bisa membaca format json
app.use(express.json())

// ==============FOR MONGODB==============
const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const URL = 'mongodb://127.0.0.1:27017'
const database = 'jc-land'

//MongoClient.connect berguna untuk mengkoneksikan API kita dengan MongoDB
// useNewUrlParser berguna untuk mengubah URL menjadi format yang bisa dibaca oleh MongoClient
/*
ARGUMENTS:
1. URL
2. optional options for insert command
3. callback -his will be called after executing this method. The first parameter will contain the Error object if an error occured
 or null otherwise. While the second parameter will contain the initialized db object or null if an error occured.
*/
MongoClient.connect(URL, {useNewUrlParser:true}, (err, client)=>{
    if(err){
            console.log(err)

    }

    // kita akan memasukkan semua yang kita lakukan di dalam MongoDB di dalam ini
    const db = client.db(database)

    app.get('/', (req,res)=>{
        res.send('<h1>Selamat datang di API 2019</h1>')
    })

    app.get('/users', (req,res)=>{
        db.collection('users').find({}).toArray()
        .then((result)=>{
            console.log(result)
            res.send(result)
        })
    })

    app.post('/inputsatudata', (req,res)=>{
        //ambil data dari user database
        // apa yang di post di UI oleh user, bisa diambil dengan req.body
        // console.log(req.body)

        //app.get -> mengambil datanya dengan req.query
        //app.post -> mengambil datanya dengan req.body

        // post ke database
        const data_name = req.body.name
        const data_age = req.body.age
        const data_married = req.body.married

        db.collection('users').insertOne({
            name: data_name,
            age: data_age,
            married: data_married
        }).then((result)=>{
            res.send('Data berhasil ditambahkan')
            console.log(result)
        })
    })    

})


app.listen(port, ()=>{
    console.log('API connected on port 2019')
})