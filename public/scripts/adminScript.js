$(function () {
    $('#loadUsers').click(function () {
        $('#loadUsers').addClass("loading");
        fetchUsers().then((response) => {
            renderUsers(response);
        });
    })
    $('.settings.item').click(function () {
        $('.ui.settings.modal').modal('show');
    });

    $('.ui.dropdown .remove.icon').on('click', function (e) {
        $(this).parent('.dropdown').dropdown('clear');
        if ($(this).parent('.dropdown').attr('id') == "userList") {
            $('.personality.dropdown').removeClass('disabled');
        } else {
            $('.user.dropdown').removeClass('disabled');
        }
        e.stopPropagation();
    });
    $('.ui.dropdown').dropdown({
        forceSelection: false
    });

    $('.personality.dropdown .menu .item').click(function () {
        $('.user.dropdown').removeClass('disabled');
        $('.user.dropdown').addClass('disabled');
    })
    //
    $('.ui.checkbox').checkbox();
    $('.ui.form').form({
        fields: {
            email: 'email',
            password: 'empty'
        },
        onSuccess: function (event, fields) {
            $('#submitBtn').addClass('loading')
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
    let generateBestMatch = function (settings) {
        console.log(settings);
        $.ajax({
            type: 'GET',
            url: "admin/genMatch/" + JSON.stringify(settings),
            success: function (response) {
                $('#generateIcon').removeClass("loading");
                $('#generateBtn').removeClass("disabled");
                renderMatchResults(response)
                //console.log(response);
            },
            failure: function (errMsg) {
                $('#generateIcon').removeClass("loading");
                $('#generateBtn').removeClass("disabled");
                console.log(errMsg)
            },
            timeout: 30000
        });
    }
    let renderUsers = function (userList) {
        $('#userList .menu').html("");
        for (var i = 0; i < userList.length; i++) {
            if (userList[i].sex == "male") {
                $('#userList .menu').append(`<div class="item" data-value="${userList[i]._id}"><i class="mars icon"></i>${userList[i].name}</div>`);
            } else {
                $('#userList .menu').append(`<div class="item" data-value="${userList[i]._id}"><i class="venus icon"></i>${userList[i].name}</div>`);
            }
        }

        $('.user.dropdown .menu .item').click(function () {
            $('.personality.dropdown').removeClass('disabled');
            $('.personality.dropdown').addClass('disabled');
        })
        $('#loadUsers').removeClass("loading");
    }
    let renderMatchResults = function (matches) {
        var match = JSON.parse(matches);
        var templete = `
        <table class="ui basic collapsing campact celled table">
            <thead>
                <tr>
                    <th>
                        <h1 class="ui header">Matches</h1>
                    </th>
                    <th>
                        <h1 class="ui header">Tentitive Match</h1>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <div class="ui huge labels">
                            <a class="ui basic yellow image label">
                                <img src="https://semantic-ui.com/images/avatar2/small/lena.png"> ${match[0].name}
                            </a>
                            <a class="ui basic green image label">
                            <img src="https://semantic-ui.com/images/avatar2/small/matthew.png"> ${match[1].name}
                            </a>
                        </div>
                    </td>
                    <!--<td>
                        <a class="ui basic yellow huge image label">
                        <img src="https://semantic-ui.com/images/avatar2/small/lindsay.png"> Andrew Gray
                        </a>
                    </td>-->
                </tr>
            </tbody>
        </table>
        `;
        $('#matchMessage').addClass("hidden")
        $('#matchTable').html(templete);
    }
    let match = function () {
        var male = $('.ui.male.checkbox').checkbox('is checked') ? "male" : false;
        var female = $('.ui.female.checkbox').checkbox('is checked') ? "female" : false;
        var user = $('#user').val();
        var hall = $('#hall').val();
        var personality = $("#personality").val();
        var settings = null;

        if (user) { //check to see if we are finding match for a individual
            if (male && female || !male && !female) { //check to see if sex matters
                if (hall) { //check to see if a hall was specified
                    settings = { "user": { id: user, filter: { hall: hall.split(",") } } };
                } else {
                    settings = { "user": { id: user } };
                }

            } else if ($('.ui.male.checkbox').checkbox('is checked')) { //check to see if male only
                if (hall) { //check to see if a hall was specified
                    settings = { "user": { id: user, filter: { hall: hall.split(","), sex: male } } };
                } else {
                    settings = { "user": { id: user, filter: { sex: male } } };
                }
            } else if ($('.ui.female.checkbox').checkbox('is checked')) { //check to see if female only
                if (hall) { //check to see if a hall was specified
                    settings = { "user": { id: user, filter: { hall: hall.split(","), sex: female } } };
                } else {
                    settings = { "user": { id: user, filter: { sex: male } } };
                }
            }
        } else if (personality) {
            if (male && female || !male && !female) { //check to see if sex matters
                if (hall) { //check to see if a hall was specified
                    settings = { "personality": { personality: personality, filter: { hall: hall.split(",") } } };
                } else {
                    settings = { "personality": { personality: personality } };
                }

            } else if ($('.ui.male.checkbox').checkbox('is checked')) { //check to see if male only
                if (hall) { //check to see if a hall was specified
                    settings = { "personality": { personality: personality, filter: { hall: hall.split(","), sex: male } } };
                } else {
                    settings = { "personality": { personality: personality } };
                }
            } else if ($('.ui.female.checkbox').checkbox('is checked')) { //check to see if female only
                if (hall) { //check to see if a hall was specified
                    settings = { "personality": { personality: personality, filter: { hall: hall.split(","), sex: female } } };
                } else {
                    settings = { "personality": { personality: personality } };
                }
            }
        } else if (male && female || !male && !female) { //check to see if sex matters
            if (hall) { //check to see if a hall was specified
                settings = { "hall": { hall: hall.split(",") } };
            } else {
                settings = {};
            }

        } else if (male) {
            if (hall) { //check to see if a hall was specified
                settings = { "sex": { sex: male, filter: { hall: hall.split(",") } } };
            } else {
                settings = { "sex": { sex: male } };
            }
        } else if (female) {
            if (hall) { //check to see if a hall was specified
                settings = { "sex": { sex: female, filter: { hall: hall.split(",") } } };
            } else {
                settings = { "sex": { sex: female } };
            }
        } else if (hall) {
            settings = { "hall": { hall: hall.split(",") } };
        } else {
            return {};
        }
        return settings;
    }
    $('.generate.button').click(function () {
        console.log("clicked")
        $('.generate.button .sync.icon').addClass("loading");
        $('.generate.button').addClass("disabled");
        let settings = match();
        generateBestMatch(settings);
    });

});