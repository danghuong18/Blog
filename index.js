// const mongoose = require("mongoose");
const express = require("express");
const app  = express();
const path = require("path");
const UserModel = require("./model/userModel");
const UserRouter = require("./router/userRouter");
const PostRouter = require("./router/postRouter");
const cookieParser = require("cookie-parser");
const checkLogin = require("./checkLogin");
require('dotenv').config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "../EXPRESS")))
app.use("/user", UserRouter);
app.use("/post", PostRouter);

app.set("view engine", "ejs");
app.get("/home", checkLogin, async (req, res)=>{
    try {
        let limit = req.query.limit*1;
        let skip = (req.query.page - 1)*limit;
        let data = await UserModel.find({}).skip(skip).limit(limit);
        if(data.length){
            // res.render({message: "Successed", status: 200, data: {data: data, role: req.role}});
            res.render("../pages/home", {data: data, role: req.role})
        }

    } catch (err) {
        res.render("../pages/home")
    }
    // let limit = req.query.limit*1;
    // let skip = (req.query.page - 1)*limit;
    // UserModel.find({}).skip(skip).limit(limit).then(function(data){
    //     if(data.length){
    //         res.json({message: "Successed", status: 200, data: {data: data, role: req.role}});
    //     }else{
    //         res.json({message: "Out-of-list", status: 400});
    //     }
    // }).catch(function(err){
    //     res.json({message: "Lỗi server!", status: 500, err});
    // })
});

app.get("/home", checkLogin, async (req, res)=>{
    try {
        
        let password = fs.readFileSync("password.txt", "utf-8");
        // console.log(password);
        let verify = jwt.verify(req.cookies.userID, password).id;
        let data = await UserModel.findOne({_id: verify});
        if(data){
            res.render("../pages/home", {name: data.username})
        }
    } catch (err) {
        res.json({message: "Lỗi server!", err, status: 500});
    }
    // var mascots = [
    //     { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012},
    //     { name: 'Tux', organization: "Linux", birth_year: 1996},
    //     { name: 'Moby Dock', organization: "Docker", birth_year: 2013}
    //   ];
    // res.render("../view/pages/home", {
    //     tagline: "No one care you okay!",
    //     mascots: mascots
    // });
});

app.get("/", (req, res)=>{
    // res.send({some: "I dont know you bro"});
    console.log(req.cookies);
    res.sendFile(path.join(__dirname, "./view/index.html")); 
});

app.get("/login", (req, res)=>{
    res.sendFile(path.join(__dirname, "./view/login.html"));
});

app.get("/signup", (req, res)=>{
    res.sendFile(path.join(__dirname, "./view/signup.html"));
});

app.get("/cpanel", (req, res)=>{
    res.sendFile(path.join(__dirname, "./view/cpanel.html"));
});

app.get("/list-user", (req, res)=>{
    res.sendFile(path.join(__dirname, "./view/list-user.html"));
});

app.get("/create-post", (req, res)=>{
    res.sendFile(path.join(__dirname, "./view/create-post.html"));
});

app.get("/edit-post", (req, res) =>{
    res.sendFile(path.join(__dirname, "./view/edit-post.html"));
});

app.get("/list-post", (req, res)=>{
    res.sendFile(path.join(__dirname, "./view/list-post.html"));
});

app.get("/view-post", (req, res)=>{
    res.sendFile(path.join(__dirname, "./view/view-post.html"));
});

app.listen(process.env.PORT || 333);