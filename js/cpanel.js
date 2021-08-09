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
            <span class="logout" onclick="logout()"><i class="fas fa-sign-out-alt"></i> Thoát</span></div>`;
            $(".greeting").html(greeting);
            $(".header-container").append(header);
        }
    }
});