$(function () {
    $('.dropdown').dropdown();
    $('.ui.checkbox').checkbox();
    //$('.ui.radio.checkbox').checkbox();
    $('.inverted.red.button').on('click', function () {
        var tab = $(this).attr('data-tab');
        console.log(tab);
        $('.secondary.menu .item').removeClass('active');
        $(`.${tab}.item`).addClass('active');
        $(`.${tab}.item`).removeClass('disabled');
        
        $.tab('change tab', $(this).attr('data-tab'));
    });
    $('.ui.form').form({
        fields: {
            name: 'empty',
            dob: 'empty',
            sex: 'empty',
            email: ['email', 'empty'],
            phone: ['maxCount[13]', 'empty'],
            address: 'empty',
            personality: 'empty',
            terms:'checked'
        },
        onSuccess: (event, fields) => {
            console.log("successful submission");
            $.ajax({
                type: 'POST',
                url: 'register?' + $("form").serialize(),
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