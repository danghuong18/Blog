function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function logout(){
    $.ajax({
        url: "/user/logout",
        type: "GET"
    }).then((data)=>{
        if(data.status == 200){
            setCookie('userID', '', -7);
            location.reload();
        }
    })
}

$(".header-name").on("click", ()=>{
    window.location.href = "/";
});
