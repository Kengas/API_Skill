const express = require('express')
const app = express()
const cors = require('cors')
const multer = require('multer');
const bodyParser = require('body-parser')
const { query } = require('express')
// const { default: knex } = require('knex')
const port = 4500
app.use(bodyParser.json())
app.use(cors())
app.use(express.static('./uploads'))

const db = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'd5_2564'
    }
})


// แสดงข้อมูล
app.get('/list' , async ( req , res ) =>{
    console.log('list=>' , req.query)
    try{
        let row = await db('user_d5')
        res.send({
            status: 1,
            datas: row
        })
    }catch(e){
        res.send({
            status: 'error',
            msg: e.message
        })
    }
})

// ลบข้อมูล
app.get('/del', async (req , res) =>{
    console.log('delete=>' , req.query)
    try{
        let row = await db('user_d5')        
        .del()
        .where({ std_id: req.query.std_id })                
        res.send({
            status: 1,
            msg: 'Deleted!',
        })
    }catch(e){
        console.log('error_delete')
        console.log(e.message)
        res.send({
            status: 0,
            msg: e.message,
        })
    }
})


// แสดงข้อมูลวิทยาลัย
app.get('/list_std' , async ( req , res ) =>{
    console.log('list_std =>' , req.query)
    try{
        
        let row = await db('users_student').where({ group_id : 256 })

        // let row = await db('advisors_groups')
        // .innerJoin('users_student' , 'advisors_groups.group_id' , '=' , 'users_student.group_id')
        // .innerJoin('users_advisor' , 'users_advisor.user_id' , '=' , 'advisors_groups.advisor_id')
        // .where('users_advisor.user_id' , '=' , 244)

        // SELECT *
        // FROM advisors_groups
        // JOIN users_student
        // ON advisors_groups.group_id = users_student.group_id
        // JOIN users_advisor
        // ON users_advisor.user_id = advisors_groups.advisor_id
        // where  users_advisor.user_id = 244

        res.send({
            status: 1,
            datas: row
        })
    }catch(e){
        res.send({
            status: 'error',
            msg: e.message
        })
    }
})

// SET STORAGE
var storage1 = multer.diskStorage({
    destination:  (req, file, cb) => {
      cb(null, 'uploads')      
    },
    filename:  (req, file, cb) => {
      let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
      cb(null, 'img-' + Date.now() + ext )
    },
  })

  var upload1 = multer({ storage: storage1 })
  var upload2 = multer({ storage: storage1 })
  var upload3 = multer({ storage: storage1 })


app.post('/upload', upload1.any() ,async (req, res) => {
    console.log(req.files[0]);
    console.log('คุณสมบัติของfile:',req.files[0])
    console.log('length=>',req.files[0].originalname.length)
    console.log('lastIndex=>',req.files[0].originalname.lastIndexOf('.'))
    res.send({ 
        status: true, filesname: req.files[0].filename
    })
})
app.post('/upload', upload2.any() ,async (req, res) => {
    console.log(req.files[0]);
    console.log('คุณสมบัติของfile:',req.files[0])
    console.log('length=>',req.files[0].originalname.length)
    console.log('lastIndex=>',req.files[0].originalname.lastIndexOf('.'))
    res.send({ 
        status: true, filesname: req.files[0].filename
    })
})
app.post('/upload', upload3.any() ,async (req, res) => {
    console.log(req.files[0]);
    console.log('คุณสมบัติของfile:',req.files[0])
    console.log('length=>',req.files[0].originalname.length)
    console.log('lastIndex=>',req.files[0].originalname.lastIndexOf('.'))
    res.send({ 
        status: true, filesname: req.files[0].filename
    })
})

// console.log(`upload => ` , storage)

// เพิ่มข้อมูลเข้า Database
app.post('/save' ,async ( req , res ) =>{    
    try{           

            // ตรวจสอบไอดีซ้ำ
            let show = await db('user_d5').where({ std_id : req.body.std_id })
            console.log('show= ',show[0])

            if(show[0]){
                console.log('no insert')
                res.send({
                    status: 0,
                    msg: 'มีผู้ใช้ในระบบแล้ว',
                })
            }

            if(req.body.img1 == ""){
                req.body.img1 = "avatar.png"
                console.log("image-blank1 =>" , req.body.img1)                
            }
      
            // เพิ่มข้อมูล
            let row = await db('user_d5').insert({
                // ให้ฟิล std_id ในฐานข้อมูล มีค่าเท่ากับ ค่า std_id ที่อยู่ใน body 
                std_id: req.body.std_id,
                title: req.body.title,
                fname: req.body.fname,
                lname: req.body.lname,
                dep_id: req.body.dep_id,
                teacher_id: req.body.teacher_id,
                pass: req.body.pass,
                img1: req.body.img1,
                img2: req.body.img2,
                img3: req.body.img3,        
            })
            res.send({
                status: 1,
                msg: 'บันทึกข้อมูล',
            })

    }catch(e){
        console.log('error')
        console.log(e.message)
        res.send({
            status: 0 ,
            error: e.message
        })
    }    
})

// Login
app.post('/login' ,async ( req , res ) =>{    
    try{           

            // ตรวจสอบไอดีซ้ำ
            let check = await db('user_d5').where({ std_id : req.body.user , pass: req.body.passwd })
            console.log('check= ',check[0])

            if(check[0]){
                console.log('Login is complete.')
                res.send({
                    status: 1,
                    msg: 'Login is complete.',
                    val: check[0]
                })
            }else{
                console.log('Something went wrong, plase try again.')
                res.send({
                    status: 0,
                    msg: 'Something went wrong.',
                })
            }
      
            // เพิ่มข้อมูล
            // let row = await db('user_d5').insert({
            //     // ให้ฟิล std_id ในฐานข้อมูล มีค่าเท่ากับ ค่า std_id ที่อยู่ใน body 
            //     std_id: req.body.std_id,
            //     title: req.body.title,
            //     fname: req.body.fname,
            //     lname: req.body.lname,
            //     dep_id: req.body.dep_id,
            //     teacher_id: req.body.teacher_id,
            //     pass: req.body.pass,
            //     img1: req.body.img1,
            //     img2: req.body.img2,
            //     img3: req.body.img3,        
            // })
            // res.send({
            //     status: 1,
            //     msg: 'บันทึกข้อมูล',
            // })
    }catch(e){
        console.log('error')
        console.log(e.message)
        res.send({
            status: 0 ,
            error: e.message
        })
    }    
})


// แก้ไขข้อมูล

app.get('/edit', async (req , res) =>{
    console.log('list_edit=>' , req,query)
    try{
        let row = await db('user_d5').where({ std_id: req.query.std_id })
        res.send({
            status: 1,
            row: row[0],
            // filesname: req.files[0].filename,
        })
    }catch(e){
        res.send({
            status: 'error',
            msg: e.message,
        })
    }
})


// เพิ่มข้อมูลเข้า Update
app.post('/update', upload1.any() , async ( req , res ) =>{
    console.log('update data=>' , req.body)
    try{    
        // เพิ่มข้อมูล

        if(req.body.img1 == "" && req.body.img_copy2 == ""){
            req.body.img1 = "avatar.png"
            console.log("image-blank1 =>" , req.body.img1)
            console.log("image-blank2 =>" , req.body.img_copy2)
        }else if(req.body.img1 == "" && req.body.img_copy2 != ""){
            req.body.img1 = req.body.img_copy2
        }
        
        let row = await db('user_d5')
        .where({ std_id : req.body.std_id })
        .update({
            // ให้ฟิล std_id ในฐานข้อมูล มีค่าเท่ากับ ค่า std_id ที่อยู่ใน body             
            title: req.body.title,
            fname: req.body.fname,
            lname: req.body.lname,
            dep_id: req.body.dep_id,
            teacher_id: req.body.teacher_id,
            pass: req.body.pass, 
            img1: req.body.img1,
            img2: req.body.img2,
            img3: req.body.img3,            
        })
        res.send({
            status: 1,
            msg: 'แก้ไขข้อมูล',            
        })
    }catch(e){
        console.log('error')
        console.log(e.message)
        res.send({
            status: 0 ,
            error: e.message
        })
    }    
})



app.listen(port,()=>{
    console.log(`Listening at http://localhost:${port}`)
})
