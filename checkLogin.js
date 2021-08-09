const UserModel = require("./model/userModel");
const BlackListModel = require("./model/blackListModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");

async function checkLogin(req, res, next){
    try {
        let checkExistCookie = await BlackListModel.findOne({token: req.cookies.userID});
        if(!checkExistCookie) {
            let password = fs.readFileSync("password.txt", "utf-8");
            // console.log(password);
            let verify = jwt.verify(req.cookies.userID, password).id;
            const data = await UserModel.findOne({_id: verify});
            if(data){
                req.role = data.role;
                req.username = data.username;
                req.userID = data._id;
                next();
            }else{
                res.json({message: "Bạn chưa đăng nhập.", status: 400})
            }
        }else{
            res.json({message: "Token không hợp lệ.", status: 400})
        }
    } catch (err) {
        res.json({message: "Lỗi server!", status: 500, err})
    }
}

module.exports = checkLogin;