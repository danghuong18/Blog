$.ajax({
    url: '/user/checkLogin',
    type: 'GET'
}).then((data)=>{
    if(data){
        if(data.status == 200){
            window.location.href = "/cpanel";
        }else{
            let header = `<div class="header-left">
            <a href="/login" title="Đăng nhập"><span><i class="fa fa-user"></i> Đăng nhập</span></a>
            </div>`;
            $(".header-container").append(header);
         }
    }
})

$(".submit").on("click", ()=>{
    let username = $(".username").val();
    let password = $(".password").val();

    $.ajax(
        {
            url: '/user/signup',
            type: 'POST',
            data: {
                username: username,
                password: password
            }
        }
    ).then((data)=>{
        console.log(data);
        if(data){
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
            setTimeout(function(){
                if(data.status == 200){
                    window.location.href = "./login";
                }
            }, 3000);
        }
    })
})
