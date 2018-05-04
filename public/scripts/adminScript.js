$(function () {
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
});