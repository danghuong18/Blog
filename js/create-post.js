$(".submit").on("click", ()=>{
    let title = $(".title").val();
    let content = $(".content").val();

    $.ajax({
        url: '/post/create',
        type: 'POST',
        data: {
            title: title,
            content: content
        }
    }).then((data)=>{
        $("#notification").removeClass();
        
        if(data.status == 200){
            $("#notification").addClass("successful");
            setTimeout(()=>{
                window.location.href = "/view-post#" + data.postid;
            }, 3000)
        }
        else if(data.status == 400){
            $("#notification").addClass("warning");
        }
        else if(data.status == 500){
            $("#notification").addClass("fail");
        }

        if(data){
            $("#notification").html(data.message);
        }
        console.log(data);
    })
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