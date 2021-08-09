const express = require("express");
const checkLogin = require("../checkLogin");
const PostModel = require("../model/postModel");
const router = express.Router();

router.get("/", checkLogin, (req, res)=>{
    let limit = req.query.limit*1;
    let skip = (req.query.page - 1)*limit;

    PostModel.find({}).populate("userID").skip(skip).limit(limit).then(function(data){
        if(data.length > 0){
            let data_edit = [];
            if(req.role === 'admin'){
                for(x in data){
                    data_edit.push({_id: data[x]._id, title: data[x].title, author: {_id: data[x].userID._id, name: data[x].userID.username}});
                }
            }else{
                for(x in data){
                    if(String(data[x].userID._id) == String(req.userID)){
                        data_edit.push({_id: data[x]._id, title: data[x].title, author: {_id: data[x].userID._id, name: data[x].userID.username}});
                    }
                }
            }

            if(data_edit){
                res.json({message: "Succcessed", status: 200, data: data_edit, role: req.role});
            }else{
                res.json({message: "Không có bài viết để hiển thị.", status: 400});
            }

        }else{
            res.json({message: "Không có bài viết để hiển thị.", status: 400});
        }
    }).catch(function(err){
        res.json({message: "Lỗi server!", status: 500, err});
    })
});

router.post("/create", checkLogin, (req, res)=>{
    let title = req.body.title;
    let content = req.body.content;
    if(title.length < 20 || content.length < 70 ) {
        res.json({message: "Tiêu đề hoặc nội dung quá ngắn.", status: 400});
    }else{
        PostModel.create({title: title, content: content, userID: req.userID}).then(function(data){
            res.json({message: "Tạo bài viết thành công!", postid: data._id, status: 200});
        }).catch(function(err){
            res.json({message: "Lỗi server!", status: 500, err});
        });
    }
});

router.get("/total-post", checkLogin, (req, res)=>{
    PostModel.find({}).populate("userID").then(function(data){
        let total = 0;
        if(req.role === 'admin'){
            total = data.length;
        }else{
            for(x in data){
                if(String(data[x].userID._id) == String(req.userID)){
                    total+=1;
                }
            }
        }
        // console.log(data);
        res.json({message: "Successed", status: 200, total: total});
    }).catch(function(err){
        res.json({message: "Lỗi server!", status: 500, err});
    })
});

router.post("/delete", checkLogin, (req, res)=>{
    if(req.role === 'admin'){
        PostModel.deleteOne({_id: req.body._id}).then(function(data){
            if(data.deletedCount){
                res.json({message: 'Xoá bài viết thành công!', status: 200, data});
            }
            else{
                res.json({message: 'Không tìm thấy user để xoá.', status: 400});
            }
        }).catch(function(err){
            res.json({message: "Lỗi server!", status: 500, err});
        })
    }else{
        res.json({message: 'Bạn không có quyền xoá bài này.', status: 400});
    }
});

router.get("/:id", (req, res)=>{
    PostModel.findOne({_id: req.params.id}).populate("userID").then(function(data){
        if(data){
            // console.log(data);
            res.json({message: "Lấy bài viết thành công!", status: 200, data: {_id: data._id, title: data.title, content: data.content, author: {_id: data.userID._id, name: data.userID.username}}});
        }else{
            res.json({message: "Không tìm thấy bài viết.", status: 400});
        }
    }).catch(function(err){
        res.json({message: "Lỗi server!", status: 500, err});
    });
});

module.exports = router;