$(document).ready(()=>{
    let baseURL = document.baseURI
    let splitURL = baseURL.split("#");
    if(splitURL.length == 2){
        $.ajax({
            url: '/post/' + splitURL[1],
            type: 'GET'
        }).then((data)=>{
            if(data.status == 200){
                $("title").html(data.data.title + " | BLOG DANGHUONG18");
                $(".post-title").html(data.data.title);
                $("span.author").html(data.data.author.name);
                $(".post-content").html(data.data.content);
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
        if(data.status == 200){
            let greeting = `Chào ${data.username}, đến với <span class="web-name">BLOG DANGHUONG18</span>!`;
            let header = `<div class="header-left">
            <a href="/cpanel" title="Cpanel"><span><i class="fas fa-columns"></i></span></a>
            <span class="logout" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Thoát</span></div>`;
            $(".greeting").html(greeting);
            $(".header-container").append(header);
         }else{
            let header = `<div class="header-left">
            <a href="/login" title="Đăng nhập"><span><i class="fa fa-user"></i> Đăng nhập</span></a>
            <a href="/signup" title="Đăng ký"><span><i class="fa fa-user-plus"></i> Đăng ký</span></a>
            </div>`;
            $(".header-container").append(header);
         }
    }
});