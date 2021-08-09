function getList(limit, page){
    $.ajax({
        url: '/user?limit=' + limit + '&page='+page,
        type: 'GET'
    }).then((data)=>{
        if(data.status == 200){
            let list_user = '';
            console.log(data);
            for(x in data.data.data){
                list_user+=`<li class="user-item user-${data.data.data[x]._id}">
                <div>User: ${data.data.data[x].username}</div>
                <div>Role: ${data.data.data[x].role}</div>
                ${data.data.role === 'admin'? `<div class="delete-user" id="${data.data.data[x]._id}">x</div>`:''}
                </li>`;
            }
            if(data.data.role === 'admin'){
                list_user+=`<script>$(".delete-user").on("click", function(){
                    let userid = $(this).attr("id");
                    $(".user-" + userid).remove();
                    $.ajax({
                        url: '/user/delete',
                        type: 'POST',
                        data: {
                            _id: userid
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
            $(".main-body > ol").html(list_user);
        }else{
            $(".main-body > ol").html('');
       }
    });
}

function getListPage(limit){
    $.ajax({
        url: '/user/total-user',
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