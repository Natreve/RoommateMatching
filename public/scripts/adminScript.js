$(function () {
    $('.settings.item').click(function () {
        $('.ui.settings.modal').modal('show');
    })
    $('.ui.dropdown').dropdown({
        forceSelection: false
    });
    $('.ui.checkbox').checkbox();
    $('.ui.form').form({
        fields: {
            email: 'email',
            password: 'empty'
        },
        onSuccess: function (event, fields) {
            $.ajax({
                type: 'POST',
                url: 'admin/login?' + $("form").serialize(),
                data: $("form").serialize(),
                success: function (response) {
                    console.log(response)
                    if (response) window.location = '/admin';
                    else $('.negative.message').removeClass('hidden')
                },
                failure: function (errMsg) {
                    console.log("err" + errMsg);
                }
            });
            return false;
        },
        onFailure: function (event, fields) {
            console.log("unsuccessful submission")
            return false;
        }
    })
    let fetchUsers = function () {
        console.log("fetch users")
        $('#userList').addClass("loading");
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: 'GET',
                url: "api/users/",
                data: {},
                success: function (response) {
                    resolve(response)
                },
                failure: function (errMsg) {
                    console.log(errMsg);
                }
            });
        });
    };
    //TO BE DONE
    let match = function () {
        var settings = {
        
        };
    }
    $('.generate.item').click(function () {
        match();
    });
    let renderUsers = function (userList) {
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].sex == "male") {
                $('#userList .menu').append(`<div class="item" data-value="${userList[i]._id}"><i class="mars icon"></i>${userList[i].name}</div>`);
            } else {
                $('#userList .menu').append(`<div class="item" data-value="${userList[i]._id}"><i class="venus icon"></i>${userList[i].name}</div>`);
            }
        }
        $('#userList').removeClass("loading");
    }
    fetchUsers().then((response) => {
        renderUsers(response);
    });

});