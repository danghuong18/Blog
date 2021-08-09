function getList(limit, page){
    $.ajax({
        url: '/post?limit=' + limit + '&page='+page,
        type: 'GET'
    }).then((data)=>{
        if(data.status == 200){
            let list_post = '';
            console.log(data);
            for(x in data.data){
                list_post+=`<li class="post-item post-${data.data[x]._id}">
                <div class="post-cp-title"><a href="/view-post#${data.data[x]._id}" title="Xem bài viết ${data.data[x].title}" target="_blank">${data.data[x].title}</a></div>
                <div class="post-cp-author">Tác giả: ${data.data[x].author.name}</div>
                <div class="post-task">
                <a href="/edit-post#${data.data[x]._id}" title="Sửa bài viết ${data.data[x].title}"><span class="edit-post"><i class="fas fa-edit"></i> Sửa</span></a>
                ${data.role === 'admin'? `<span class="delete-post" id="${data.data[x]._id}"><i class="fas fa-trash-alt"></i> Xoá</span>`:''}</div>
                </li>`;
            }
            if(data.role === 'admin'){
                list_post+=`<script>$(".delete-post").on("click", function(){
                    let postid = $(this).attr("id");
                    $(".post-" + postid).remove();
                    $.ajax({
                        url: '/post/delete',
                        type: 'POST',
                        data: {
                            _id: postid
                        }
                    }).then(function(data){
                        $("#notification").removeClass();

                        if(data.status == 200){
                            $("#notification").addClass("successful");
                        }
                        else if(data.status == 400){
                            $("#notification").addClass("warning");
                        }
                        else if(data.status == 500){
                            $("#notification").addClass("fail");
                        }
            
                        $("#notification").html(data.message);
                    });
                });</script>`;
            }
            $(".main-body > ol").html(list_post);
        }else{
            $(".main-body > ol").html('');
       }
    });
}

function getListPage(limit){
    $.ajax({
        url: '/post/total-post',
        type: 'GET'
    }).then((data)=>{
        let list_page = '';
        if(data.status == 200){
            let total_page = Math.ceil(data.total/limit);
            console.log(total_page);
            for(x = 1; x<= total_page; x++){
                console.log(x);
                list_page+=`<span class="page ${x == 1?'active':''}" id="${x}">${x}</span>`;
            }

            list_page+=`<script>$(".page").on("click", function(){
                if(!$(this).hasClass("active")){
                    let page = $(this).attr("id");
                    let limit = $("#limit-list").val();
                    $(".page").removeClass("active");
                    $(this).addClass("active");
                    getList(limit, page);
                }
            });</script>`;

            $(".page-container").html(list_page);
        }
    });
}

$.ajax({
    url: '/user/checkLogin',
    type: 'GET'
}).then((data)=>{
    if(data){
        if(data.status != 200){
            window.location.href = "/login";
        }
        else{
            let greeting = `Chào ${data.username}, đến với bảng quản trị!`;
            let header = `<div class="header-left">
            <a href="/cpanel" title="Cpanel"><span><i class="fas fa-columns"></i></span></a>
            <a href="/list-user" title="Thành viên"><span><i class="fa fa-users"></i></span></a>
            <a href="/create-post" title="Viết bài"><span><i class="fas fa-edit"></i></span></a>
            <a href="/list-post" title="Quản lý bài viết"><span><i class="fas fa-file-alt"></i></span></a>
            <span class="logout" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Thoát</span></div>`;
            $(".greeting").html(greeting);
            $(".header-container").append(header);
        }
    }
});

$(document).ready(()=>{
    let limit = $("#limit-list").val();
    getListPage(limit);
    getList(limit, 1);
 });

$("#limit-list").on("change", ()=>{
    let limit = $("#limit-list").val();
    getListPage(limit);
    getList(limit, 1);
});

$(".page").on("click", ()=>{
    if(!$(this).hasClass("active")){
        let page = $(this).attr("id");
        let limit = $("#limit-list").val();
        $(".page").removeClass("active");
        $(this).addClass("active");
        getList(limit, page);
        console.log(limit, page);
    }
});