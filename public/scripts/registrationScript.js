$(function () {
    $('.dropdown').dropdown();
    $('.ui.checkbox').checkbox();
    $('.personal.tab').transition({
        animation: 'fade in',
        duration: '1s',
        interval: '5m',
        onComplete: function () {
        }
    });

    //BACK BUTTON
    $('.back.button').on('click', function () {
        var prevtab = $(this).attr('data-tab');
        var currentTab = $(this).attr('data-current-tab');
        $(`.${currentTab}.tab`).transition({
            animation: 'fade out',
            duration: '1s',
            interval: '5m',
            onComplete: function () {
                $('.secondary.menu .item').removeClass('active');
                $(`.${currentTab}.tab`).removeClass('active');
                $(`.${prevtab}.item`).removeClass('disabled');
                $(`.${prevtab}.item`).addClass('active');
                $(`.${prevtab}.tab`).transition({
                    animation: 'fade in',
                    duration: '1s',
                    onComplete: function () {
                        $.tab('change tab', `${prevtab}`);
                    }
                })
            }
        });
    })
    //VALIDATE SEGMENT BEFORE MOVING TO NEXT ONE
    $('.characteristics.button').on('click', function () {
        var valid = true;
        var personalSegment = [
            { 'name': 'name', 'valid': $('.ui.form').form('is valid', 'name') },
            { 'name': 'dob', 'valid': $('.ui.form').form('is valid', 'dob') },
            { 'name': 'sex', 'valid': $('.ui.form').form('is valid', 'sex') },
            { 'name': 'contact[email]', 'valid': $('.ui.form').form('is valid', 'contact[email]') },
            { 'name': 'contact[phone]', 'valid': $('.ui.form').form('is valid', 'contact[phone]') },
            { 'name': 'address', 'valid': $('.ui.form').form('is valid', 'address') },
            { 'name': 'password', 'valid': $('.ui.form').form('is valid', 'password') },
            { 'name': 'password2', 'valid': $('.ui.form').form('is valid', 'password2') },
            { 'name': 'personality', 'valid': $('.ui.form').form('is valid', 'personality') }
        ];

        for (let i = 0; i < personalSegment.length; i++) {
            if (!personalSegment[i].valid) {
                console.log(personalSegment[i].name)
                $('.ui.form').form('validate field', personalSegment[i].name);
                valid = false;
            }
        }
        console.log(valid)
        if (valid) {
            $('.personal.tab').transition({
                animation: 'fade out',
                duration: '1s',
                interval: '5m',
                onComplete: function () {
                    $('.secondary.menu .item').removeClass('active');
                    $('.personal.tab').removeClass('active');
                    $(`.characteristics.item`).removeClass('disabled');
                    $(`.characteristics.item`).addClass('active');
                    $('.characteristics.tab').transition({
                        animation: 'fade in',
                        duration: '1s',
                        onComplete: function () {
                            $.tab('change tab', 'characteristics');
                        }
                    })
                }
            })
        }
    });
    $('.preferences.button').on('click', function () {
        $('.characteristics.tab').transition({
            animation: 'fade out',
            duration: '1s',
            interval: '5m',
            onComplete: function () {
                $('.secondary.menu .item').removeClass('active');
                $('.characteristics.tab').removeClass('active');
                $(`.preferences.item`).removeClass('disabled');
                $(`.preferences.item`).addClass('active');
                $('.preferences.tab').transition({
                    animation: 'fade in',
                    duration: '1s',
                    onComplete: function () {
                        $.tab('change tab', 'preferences');
                    }
                })
            }
        })

    });
    $('.terms.button').on("click", function () {
        $('.ui.terms.modal').modal('setting', 'closable', false).modal('show');
    })
    $('.submit.button').on('click', function () {
        $('.ui.form').form("validate form")
    })
    $('.ui.form').form({
        fields: {
            name: {
                identifier: 'name',
                rules: [{ type: 'empty' }]
            },
            dob: {
                identifier: 'dob',
                rules: [{ type: 'empty' }]
            },
            sex: {
                identifier: 'sex',
                rules: [{ type: 'empty' }]
            },
            'contact[email]': {
                identifier: 'contact[email]',
                rules: [{ type: 'email' }]
            },
            'contact[phone]': {
                identifier: 'contact[phone]',
                rules: [{ type: 'minLength[7]' }, { type: 'maxLength[13]' }]
            },

            address: {
                identifier: 'address',
                rules: [{ type: 'empty' }]
            },
            password: {
                identifier: 'password',
                rules: [{ type: 'empty' }]
            },
            password2: {
                identifier: 'password2',
                rules: [{ type: 'match[password]' }, { type: 'empty' }]
            },
            personality: {
                identifier: 'personality',
                rules: [{ type: 'empty' }]
            },
            terms: {
                identifier: 'terms',
                rules: [{ type: 'checked' }]
            }
        },
        onSuccess: (event, fields) => {
            $.ajax({
                type: 'POST',
                url: 'register?' + $("form").serialize(),
                success: function (response) {
                    if (response) window.location = '/login'
                },
                failure: function (errMsg) {
                    console.log(errMsg);
                }
            });
            return false;
        },
        onFailure: (event, fields) => {
            console.log("unsuccessful submission");
            return false;
        }
    })
});