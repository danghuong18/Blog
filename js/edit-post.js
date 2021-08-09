$(document).ready(()=>{
    let baseURL = document.baseURI
    let splitURL = baseURL.split("#");
    if(splitURL.length == 2){
        $.ajax({
            url: '/post/' + splitURL[1],
            type: 'GET'
        }).then((data)=>{
            if(data.status == 200){
                $("title").html("Sửa bài " + data.data.title + " | BLOG DANGHUONG18");
                $(".edit-title").html(data.data.title);
                $(".title").val(data.data.title);
                // $("span.author").html(data.data.author.name);
                $(".content").val(data.data.content);
            }else{
                window.location.href = "/";
            }
        })
    }else{
        window.location.href = "/";
    }
 });

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