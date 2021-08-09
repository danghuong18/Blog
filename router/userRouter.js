const express = require("express");
const checkLogin = require("../checkLogin");
const UserModel = require("../model/userModel");
const BlackListModel = require("../model/blackListModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const bcrypt = require("bcrypt");
const router = express.Router();
var storage = multer.diskStorage({
    destination: (req, res, cb)=>{
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, sb)=>{
        cb(null. file.filename + "-" + Date.now()) + path.extname(file.originalname);
    }
});
const upload = multer({storage: storage});

router.get("/", checkLogin, function(req, res)
{
    let limit = req.query.limit*1;
    let skip = (req.query.page - 1)*limit;
    UserModel.find({}).skip(skip).limit(limit).then(function(data){
        if(data.length){
            res.json({message: "Successed", status: 200, data: {data: data, role: req.role}});
        }else{
            res.json({message: "Out-of-list", status: 400});
        }
    }).catch(function(err){
        res.json({message: "Lỗi server!", status: 500, err});
    })
});

router.post("/delete", checkLogin, function(req, res){
    if(req.role === 'admin'){
        UserModel.deleteOne({_id: req.body._id}).then(function(data){
            if(data.deletedCount){
                res.json({message: 'Xoá user thành công!', status: 200, data});
            }
            else{
                res.json({message: 'Không tìm thấy user để xoá.', status: 400});
            }
        }).catch(function(err){
            res.json({message: "Lỗi server!", status: 500, err});
        })
    }else{
        res.json({message: 'Bạn không có quyền xoá user này.', status: 400});
    }
});

router.get("/total-user", checkLogin, function(req, res)
{
    UserModel.find({}).then(function(data){
        res.json({message: "Successed", status: 200, total: data.length});
    }).catch(function(err){
        res.json({message: "Lỗi server!", status: 500, err});
    })
});

router.post("/login", async (req, res)=>{
    try {
        let data = await UserModel.findOne({username: req.body.username});
        if(data){
            let compare = await bcrypt.compare(req.body.password, data.password)
            if(compare){
                let password = fs.readFileSync("password.txt", "utf-8");
                let token = jwt.sign({id: data._id}, password);
                res.json({message: "Đăng nhập thành công!", status: 200, data:token});
            }else{
                res.json({message: "Sai username hoặc password.", status: 400});
            }

        }
        else{
            res.json({message: "Sai username hoặc password.", status: 400});
        }
    } catch (err) {
        res.json({message: "Lỗi server!", err, status: 500});
    }

    // UserModel.findOne({username: req.body.username, password: req.body.password}).then(function(data){
    //     if(data){
    //         let password = fs.readFileSync("password.txt", "utf-8");
    //         let token = jwt.sign({id: data._id}, password);
    //         res.json({message: "Đăng nhập thành công!", status: 200, data:token});
    //     }
    //     else{
    //         res.json({message: "Sai username hoặc password.", status: 400});
    //     }
    // }).catch(function(err){
    //     res.json({message: "Lỗi server!", err, status: 500});
    // })
});

router.get("/logout", checkLogin, async (req, res)=>{
    try {
        await BlackListModel.create({token: req.cookies.userID});
        res.json({message: "Đăng xuất thành công!", status: 200});
    } catch (err) {
        res.json({message: "Lỗi server!", err, status: 500});
    }
});

router.get("/checkLogin", checkLogin, (req, res)=>{
    res.json({message: "User đã đăng nhập.", status: 200, username: req.username});
});

router.post("/signup", async (req, res)=>{
    try {
        let findByUsername = await UserModel.findOne({username: req.body.username});

        if(findByUsername) {
            res.json({message: "Tên đăng nhập đã tồn tại.", status: 400});
        }else{
            req.body.password = await bcrypt.hash(req.body.password, 3333);
            let data = await UserModel.create({username: req.body.username, password: req.body.password});
            if(data){
                res.json({message: "Đăng ký thành công!", status: 200});
            }else{
                res.json({message: "Lỗi server!", status: 500});
            }
        }
    } catch (err) {
        res.json({message: "Lỗi server!", status: 500, err});
    }
    // UserModel.findOne({username: req.body.username}).then((data)=>{
    //     if(data){
    //         res.json({message: "Tên đăng nhập đã tồn tại.", status: 400});
    //     }
    //     else{
    //         req.body.password = bcrypt.hash(req.body.password, 3333);
    //         console.log(password);
    //         UserModel.create({username: req.body.username, password: req.body.password}).then((data)=>{
    //             res.json({message: "Đăng ký thành công!", status: 200});
    //         }).catch((err)=>{
    //             res.json({message: "Lỗi server!", status: 500, err});
    //         });
    //     }
    // }).catch((err)=>{
    //     res.json({message: "Lỗi server!", status: 500, err});
    // })
});

router.post("/profile", upload.single("test"), (req, res)=>{
    console.log(req.body.tile);
});

module.exports = router;