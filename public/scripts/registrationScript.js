$(function () {
    $('.dropdown').dropdown();
    $('.ui.checkbox').checkbox({
        onChange: function (e) {
            if (!$(this).parent("div").parent("div").parent("span").hasClass("Checked")) {
                $(this).parent("div").parent("div").parent("span").addClass("Checked");
                $($(this).parent("div").parent("div").parent("span")).find("input").each(function (index, el) {
                    console.log($(el).attr("name"))
                    $(this).parent("div").parent("div").removeClass("error");
                });
            } else {
                $($(this).parent("div").parent("div").parent("span")).find("input").each(function (index, el) {
                    console.log(el)
                    $(this).parent("div").parent("div").removeClass("error");
                });
            }
        }
    });
    $('.ui.sticky').sticky({
        context: '#register'
    });
    $('.personal.tab').transition({
        animation: 'fade in',
        duration: '1s',
        interval: '5m',
        onComplete: function () {
            $('.personal.tab').addClass("active");
        }
    });

    //BACK BUTTON
    $('.back.button').on('click', function () {
        $(window).scrollTop(0)
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
        $(window).scrollTop(0)
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
        $(window).scrollTop(0)
        var count = 0;;
        $('.characteristics.tab .field').find("span").each(function (index) {
            console.log($(this).attr("class"))
            if ($(this).hasClass("Checked")) {
                count++
                $(this).children("div").removeClass("error")
            } else {
                $(this).children("div").addClass("error")

            }

        });
        if (count == 16) {
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
        } else {
            console.log("not valid")
        }
    });
    $('.terms.button').on("click", function () {
        var count = 0;;
        $('.preferences.tab .field').find("span").each(function (index) {
            if ($(this).hasClass("Checked")) {
                count++
                $(this).children("div").removeClass("error")
            } else {
                $(this).children("div").addClass("error")
            }

        });
        if (count == 16) $('.ui.terms.modal').modal('setting', 'closable', false).modal('show');
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
            "char[peoplePerson]": {
                identifier: 'char[peoplePerson]',
                rules: [{ type: 'checked' }]
            },
            'char[visitorFrequency]': {
                identifier: 'char[visitorFrequency]',
                rules: [{ type: 'checked' }]
            },
            'char[visitorNotification]': {
                identifier: 'char[visitorNotification]',
                rules: [{ type: 'checked' }]
            },
            'char[romanticVisitor]': {
                identifier: 'char[romanticVisitor]',
                rules: [{ type: 'checked' }]
            },
            'char[videoCalling]': {
                identifier: 'char[videoCalling]',
                rules: [{ type: 'checked' }]
            },
            'char[roomOrganization]': {
                identifier: 'char[roomOrganization]',
                rules: [{ type: 'checked' }]
            },
            'char[cleanliness]': {
                identifier: 'char[cleanliness]',
                rules: [{ type: 'checked' }]
            },
            'char[chores]': {
                identifier: 'char[chores]',
                rules: [{ type: 'checked' }]
            },
            'char[privacy]': {
                identifier: 'char[privacy]',
                rules: [{ type: 'checked' }]
            },
            'char[activeTime]': {
                identifier: 'char[activeTime]',
                rules: [{ type: 'checked' }]
            },
            'char[lightOut]': {
                identifier: 'char[lightOut]',
                rules: [{ type: 'checked' }]
            },
            'char[music]': {
                identifier: 'char[music]',
                rules: [{ type: 'checked' }]
            },
            'char[studyEnvi]': {
                identifier: 'char[studyEnvi]',
                rules: [{ type: 'checked' }]
            },
            'char[studyLocation]': {
                identifier: 'char[studyLocation]',
                rules: [{ type: 'checked' }]
            },
            'char[expectation]': {
                identifier: 'char[expectation]',
                rules: [{ type: 'checked' }]
            },
            'char[borrowing]': {
                identifier: 'char[borrowing]',
                rules: [{ type: 'checked' }]
            }
        },
        onSuccess: (event, fields) => {
            $.ajax({
                type: 'POST',
                url: 'register?' + $("form").serialize(),
                success: function (response) {
                    if (response) window.location = '/login'
                    else if (!response || response == "false") $('.error.message').removeClass("hidden").html("User already on record")
                    else {
                        $('.error.message').removeClass("hidden").html("There was a server error")
                    }
                },
                failure: function (errMsg) {
                    $('.error.message').removeClass("hidden").html("User on record")
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