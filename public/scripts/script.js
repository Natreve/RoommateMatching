$(function () {
    $('.dropdown').dropdown();
    $('.ui.radio.checkbox').checkbox();
    $('.ui.form').form({
        inline: false,
        fields: {
            name: 'empty',
            dob: 'empty',
            sex: 'empty',
            email: ['email', 'empty'],
            phone: ['maxCount[13]', 'empty'],
            address: 'empty',
            personality: 'empty'
        },
        onSuccess: (event, fields) => {
            $.ajax({
                type: 'POST',
                url: '/users/add?' + $("form").serialize(),
                data: $("form").serialize(),
                success: function (response) {
                    console.log("successful submission");
                },
                failure: function (errMsg) {
                    console.log(errMsg);
                }
            });
            return false;
        },
        onFailure: (event, fields) => {
            console.log("unsuccessful submission")
            return false;
        }
    })
});