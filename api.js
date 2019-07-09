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
const database = 'jc_land'

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

    //FIND ALL DATA
    app.get('/users', (req,res)=>{
        db.collection('users').find({}).toArray()
        .then((result)=>{
            console.log(result)
            res.send(result)
        })
    })


    //FIND BY PARAMETERS
    app.get('/selecteduser',(req,res)=>{

        //app.get -> mengambil get dari postman/input user dengan REQ.QUERY
        const data_age = parseInt(req.query.age)

        db.collection('users').find({
            age:{$gt: data_age}
        }).toArray().then((results)=>{
            res.send(results)
        })
    })

    //GET USERS BY AGE AND MARRIED
    app.get('/agemarried',(req,res)=>{

        //app.get -> mengambil get dari postman/input user dengan REQ.QUERY
        const data_age = parseInt(req.query.age)
        const data_married = (req.query.married === 'true')
        //bisa juga const data_married = JSON.parse(req.query.married) --> tpi kalau diisi FALSE(dengan huruf kapital, itu tidak bisa)

        db.collection('users').find({
            age: {$gt:data_age}, 
            married: data_married
        }).toArray().then((results)=>{
            res.send(results)
        })
    })

    //GET USERS BY RANGE OF AGE
    app.get('/agerange',(req,res)=>{

        //app.get -> mengambil get dari postman/input user dengan REQ.QUERY
        const range_bawah = parseInt(req.query.bawah)
        const range_atas = parseInt(req.query.atas)

        db.collection('users').find({
            age:{$gt: range_bawah, $lt:range_atas}
        }).toArray().then((results)=>{
            res.send(results)
        })
    })

    //GET USERS MENGGUNAKAN REQ.PARAMS
    app.get('/params/:age',(req,res)=>{
        const age = parseInt(req.params.age)

        db.collection('users').find({age:{$gt:age}}).toArray().then((results)=>{
            res.send({
                message: 'Data berhasil didapatkan',
                age: results
            })
        })
    })

    //POST 1 DATA
    app.post('/inputsatudata', (req,res)=>{
        //ambil data dari user database
        // apa yang di post di UI oleh user, bisa diambil dengan REQ.BODY
        // console.log(req.body)

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
            //isinya result.ops adalah data yang kita post dalam bentuk array [{.....}]
            res.send(result.ops)
            //results.ops itu khusus untuk post, kalau GET itu hanya results
            console.log(result.ops)
        })
    })    

    //INSERTMANY   
    app.post('/insertmany', (req,res)=>{ 
        console.log(req.body)   
        const data = req.body

        db.collection('users').insertMany(data).then(results=>{
            //results.ops itu khusus untuk post, kalau GET itu hanya results
            res.send(results.ops)
        })
    })

})


app.listen(port, ()=>{
    console.log('API connected on port 2019')
})