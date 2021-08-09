function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

$.ajax({
    url: '/user/checkLogin',
    type: 'GET'
}).then((data)=>{
    if(data){
        if(data.status == 200){
            window.location.href = "/cpanel";
        }
        else{
            let header = `<div class="header-left">
            <a href="/signup" title="Đăng ký"><span><i class="fa fa-user-plus"></i> Đăng ký</span></a>
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
            url: '/user/login',
            type: 'POST',
            data: {
                username: username,
                password: password
            }
        }
    ).then(function(data){
        $("#notification").removeClass();
        
        if(data.status == 200){
            $("#notification").addClass("successful");
            setCookie('userID', data.data, 7);
            setTimeout(function(){
                window.location.href = "/cpanel";
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
    })
})
