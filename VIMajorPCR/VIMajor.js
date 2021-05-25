"use strict";

var autoLogoutVar;

$(document).ready(function () {

    $("#wait").addClass("hide");
    loadPage();

    $(document).on("click", ".defectAreaLink a", function ()
    {
        $("#defectScreenList").empty();
        $('.defectAreaTab').removeClass('btn-blue');
        $('.defectAreaTab').removeClass('btn-purple');
        $('#defectScreenList').css("background-color", "#fff");

        if ($(this).text() == "SS Code")
        {
            $('.defectAreaTab').addClass('btn-blue');
            $('#defectScreenList').css("background-color", "#31b0d5");
        }
        else if ($(this).text() == "NSS Code")
        {
            $('.defectAreaTab').addClass('btn-purple');
            $('#defectScreenList').css("background-color", "#bb8fce");
        }

        $("#defectLink").html($(this).text()+"/");
    });

    $(document).on("click", ".defectAreaTab", function () {
        var color = $(this).hasClass("btn-blue") ? "btn-blue" : "btn-purple";
        $("#defectAreaLink").html($(this).text() + "/");
        getDefectData($(this).text(),color);
    });

    $(document).on("click", ".subDefectBtn", function () {
        $(".subDefectBtn").removeClass("activeSubDefectBtn");
        $(this).addClass("activeSubDefectBtn");
        $("#subdefectAreaLink").html($(this).text());
    });

    $(document).on('keypress', '#txtbarcode', function (e) {
        // code to stop manual barcode entry
        delay(function () {
            if ($("#txtbarcode").val().length != 10) {
                $("#txtbarcode").val("");
            }
        }, 30);

        // condition for enter event
        if (e.which == 13) {
            if ($("#txtbarcode").val().length == 10) {
                $("#messageDiv").empty();

                // function to get barcode builing, curing and VI previous details and scanned barcode count shift wise
                getBarcodeDetails($("#txtbarcode").val().trim());
            }
        }
        //if the letter is not digit then don't allow to type anything
        else if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            var htm = '<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> Please enter valid barcode!</div >';

            $("#txtbarcode").val('');
            $("#messageDiv").html(htm);
            return false;
        }

    });

    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

});

function loadPage() {
    // show login view when session storage not available
    if (sessionStorage.getItem("manningID") == undefined || sessionStorage.getItem("manningID") == null) {
        $("#container-wrapper").load("Login.html", function () {

            clearInterval(autoLogoutVar);
            $("#userSettingBox, #pwdBtn, .badgeLink").addClass("hide");
        });
    }
    // show home page when user login successfully
    else {
        $("#container-wrapper").load("home.html?ver=1.1", function () {
            $("#wait").addClass("hide"); //hide loader
            $("#userSettingBox, #pwdBtn, .badgeLink").removeClass("hide");

            $(".usernameLabel").text(sessionStorage.getItem("userName"));
            $("#wcNameLabel").text(sessionStorage.getItem("wcName"));

            $("#txtbarcode").focus();

            autoLogoutVar = setInterval(autoLogout, 10000);

            getScannedDataCountUserWise();
        });
    }
}

function getDefectData(type, color) {
    $.ajax(
        {
            url: "http://" + URL + "/CTPWebAPI/api/VisualInspection/getMasterData",
            type: 'post',
            data: "{area: 'VIMajor', type : '"+type+"'}",
            datatype: 'jsonp',
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var json = JSON.parse(response);

                $("#defectScreenList").empty();
                $(".subDefectBtn").removeClass(".btn-blue");
                $(".subDefectBtn").removeClass(".btn-purple"); 

                if (json.length) {
                    var i = 0;
                    var dataLen = json.length;
                    var html = '';

                    for (i = 0; i < dataLen; i++) {
                        html += '<button style="margin: 10px;border:2px solid #fff;" data-defect-id="' + json[i].id + '" class="subDefectBtn btn btn-lg ' + color+'" type="button">' + json[i].name + '</button>';

                    }

                    $("#defectScreenList").html(html);
                }
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
}

function getBarcodeDetails(barcode) {
    $.ajax(
        {
            url: "http://" + URL + "/CTPWebAPI/api/VisualInspection/getBarcodeDetails",
            type: 'post',
            data: "{barcode: '" + barcode + "', area: 'PCR'}",
            datatype: 'jsonp',
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = JSON.parse(response);

                var tbm = 0;
                var curing = 0;
                var vi = 0;
                var html = '';
                var superMode = 0;

                $("#tbmInfoTbl, #CuringInfoTbl, #VIInfoTbl").empty();

                if (data['tbmData'].length) {
                    for (tbm = 0; tbm < data['tbmData'].length; tbm++) {
                        html += '<tr><td>' + data['tbmData'][tbm].wcname + '</td><td>' + data['tbmData'][tbm].recipe + '</td><td>' + data['tbmData'][tbm].manning + '</td><td>' + data['tbmData'][tbm].datetime + '</td></tr>';
                    }

                    $("#tbmInfoTbl").html(html);
                }

                html = '';
                //need to show data as supermode

                if (data['curingData'].length) {
                    for (curing = 0; curing < data['curingData'].length; curing++) {
                        if (data['curingData'][curing].updatestatus.toLowerCase() === "supermode") {
                            superMode = 1;
                        }
                        
                        html += '<tr><td>' + data['curingData'][curing].wcname + '</td><td>' + data['curingData'][curing].recipe + '</td><td>' + data['curingData'][curing].manning + '</td><td>' + data['curingData'][curing].datetime + '</td><td>' + data['curingData'][curing].updatestatus+'</td></tr>';
                    }

                    $("#CuringInfoTbl").html(html);
                }

                if (superMode === 1) {
                    $("#okBtn, #holdBtn").prop("disabled", true);
                } else {
                    $("#okBtn, #holdBtn").prop("disabled", false);
                }

                html = '';

                if (data['viData'].length) {
                    for (vi = 0; vi < data['viData'].length; vi++) {
                        html += '<tr><td>' + data['viData'][vi].wcname + '</td><td>' + data['viData'][vi].status + '</td><td>' + data['viData'][vi].manning + '</td><td>' + data['viData'][vi].datetime + '</td></tr>';
                    }

                    $("#VIInfoTbl").html(html);
                }
                //Tyre which is selected major in visual inspection and tyre which is coming from minor station only should accept.
                //done by sarita
                //date-24may21
                for (vi = 0; vi < data['viData'].length; vi++) {
                   // alert(data['viData'][vi].status);
                    if (data['viData'][vi].status == "MAJOR" || data['viData'][vi].status == "PASS-1" || data['viData'][vi].status == "PASS-2" || data['viData'][vi].status == "BUFF" || data['viData'][vi].status == "HOLD") {  // alert(data['viData'][vi].status);
                         $("#okBtn, #holdBtn, #scrapBtn").prop("disabled", false);
                        htm = '<div class="text-success"><span class="glyphicon glyphicon-ok font20px"></span> Barcode: ' + barcode + '  not scanned in First Line Inspection.</div >';
                        $("#messageDiv").html(htm);

                    }
                    else {
                        $("#okBtn, #holdBtn, #scrapBtn").prop("disabled", true);
                       // alert(data['viData'][vi].status);
                    }
                }
               
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
}

function openRemarkModal() {

    $("#messageDiv").empty();

    var barcode = $('#txtbarcode').val().trim();

    if (barcode == '' || barcode.length != 10) {
        var htm = '<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> Please enter valid barcode!</div >';
        $("#messageDiv").html(htm);

        return;
    }

    $("#remarkInput").val('');

    setTimeout(function () {
        $('#remarkModal').modal({ backdrop: 'static', keyboard: false });
    }, 250);
}

function closeRemarkModal()
{
	$("#remarkInput").val('');
    $('#remarkModal').modal('hide');
}

function clickSaveBtn()
{
    var defectID = $(".activeSubDefectBtn").attr('data-defect-id');
    var statusID = $("#statusType").val();
   
    var defectLink = $('#defectLink').text();
    var defectAreaLink = $('#defectAreaLink').text();

    var ssORnss = '0';
    var defectLocationID = '0';

    if (defectLink != undefined && defectLink != '')
    {
        ssORnss = (defectLink == 'SS Code/') ? '1' : '2';
    }
    if (defectAreaLink != undefined && defectAreaLink != '') {
        switch (defectAreaLink)
        {
            case 'TREAD/':
                defectLocationID = "1";
                break;
            case 'SIDEWALL/':
                defectLocationID = "2";
                break;
            case 'BEAD/':
                defectLocationID = "3";
                break;
            case 'CARCASS':
                defectLocationID = "4";
                break;
            case 'OTHERS/':
                defectLocationID = "5";
                break;
            default:
                defectLocationID = "0";
                break;
        }
    }

    $("#errMsgDiv").empty();

    // show error msg when no defect select by user while saving 
    if (defectID == undefined || defectID == null || defectID == '') {
        $("#errMsgDiv").html("Please select defect!");
        return;
    }

    saveBarcodeDetails(statusID, defectLocationID, defectID, ssORnss);
}

function saveBarcodeDetails(statusID, defectLocationID, defectStatusID, ssORnss) {
    var barcode = $("#txtbarcode").val().trim();

    $("#txtbarcode").val('');
    $("#messageDiv").empty();
    $("#txtbarcode").focus();

    if (barcode != '') {
        if (barcode.length == 10 && barcode != '0000000000') {

            var manningID = sessionStorage.getItem("manningID");
            var wcID = sessionStorage.getItem("wcID");

            // In case session storage expired
            if (manningID == undefined || manningID == '' || manningID == null || wcID == undefined || wcID == '' || wcID == null) {
                location.reload();
                return;
            }

            $.ajax(
                {
                    url: "http://" + URL + "/CTPWebAPI/api/VisualInspection/saveMajorMinorBarcodeDetails",
                    type: 'post',
                    data: "{barcode: '" + barcode + "', manning: '" + manningID + "', wcID: '" + wcID + "', defectID: '" + defectStatusID + "', area: 'VIMajor', status: '" + statusID + "', defectAreaID : '" + defectLocationID + "', remark : '" + $('#remarkInput').val() + "', ssORnss : '" + ssORnss+"' }",
                    datatype: 'jsonp',
                    crossDomain: true,
                    contentType: "application/json; charset=utf-8",
                    success: function (response) {
                        var data = JSON.parse(response);
                        var htm = '';

                        $("#okBtn, #holdBtn").prop("disabled", false);

                        if (data == "1") {
                            htm = '<div class="text-success"><span class="glyphicon glyphicon-ok font20px"></span> Barcode: ' + barcode + ' saved successfully.</div >';
                            getScannedDataCountUserWise();
                        }
                        else if (data == "-1") {
                            htm = '<div class="text-danger"><span class="glyphicon glyphicon-ok font20px"></span> Please enter valid barcode!</div >';
                        }
                        else if (data == "-3") {
                            autoLogoutFunc();
                        }

                        $("#messageDiv").html(htm);

                        closeDefectModal();
                        closeRemarkModal();
                    }
                });
        }
        else {
            var htm = '<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span>' + barcode + ' is invalid barcode!</div >';
            $("#messageDiv").html(htm);
        }
    }
    else {
        var htm = '<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span>Please scan barcode first!</div >';
        $("#messageDiv").html(htm);
    }
}

function getScannedDataCountUserWise() {

    if (sessionStorage.getItem("manningID") != undefined && sessionStorage.getItem("manningID") != null && sessionStorage.getItem("manningID") != "") {
        $.ajax(
            {
                url: "http://" + URL + "/CTPWebAPI/api/VisualInspection/getScannedDataCountUserWise",
                type: 'post',
                data: "{manning: '" + sessionStorage.getItem("manningID") + "', area: 'VIMajor', table:'vInspectionPCR'}",
                datatype: 'jsonp',
                crossDomain: true,
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    var data = JSON.parse(response);

                    if (data.length) {
                        $("#scanCount").text(data[0].userScanCount);
                    }
                    else {
                        $("#scanCount").text('0');
                    }
                },
                error: function (xhr, status, error) {
                    alert(error);
                }
            });
    }

}

function loginUser() {
    $("#messageDiv").empty();
    $('#UserIDInput, #PasswordInput').removeClass('borderRed');

    var username = $("#UserIDInput").val().trim();
    var password = $("#PasswordInput").val().trim();
    var wcID = $("#wcIDInput").val().trim();
    var wcName = $("#wcNameInput").val().trim();

    if (username == '' || password == '') {
        $("#messageDiv").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-remove font20px"></span> Please fill both fields!</div >');
        $('#UserIDInput, #PasswordInput').addClass('borderRed');
        return;
    }

    if (wcID == '' || wcName == '') {
        $("#messageDiv").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-remove font20px"></span> Work center is not configured in URL properly!</div >');
        return;
    }


    $.ajax(
        {
            url: "http://" + URL + "/CTPWebAPI/api/CommonController/loginUser",
            type: 'post',
            data: "{username: '" + username + "', password: '" + password + "', areaType:'VIMajor', wcName : '" + wcID + "'}",
            datatype: 'jsonp',
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = JSON.parse(response);

                // when user entered correct credentials
                if (data.length) {
                    if (data[0].areaType.toLowerCase() == 'vipcr')
                    {
                        sessionStorage.setItem("manningID", data[0].manningID);
                        sessionStorage.setItem("userName", data[0].name);
                        sessionStorage.setItem("wcID", wcID);
                        sessionStorage.setItem("wcName", wcName);

                        // view loader
                        $("#wait").removeClass("hide");

                        loadPage();
                    }
                    else {
                        $("#messageDiv").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-remove font20px"></span> You do not have permission to login!</div>');
                    }
                }
                else {
                    $("#messageDiv").html('<div class="alert alert-danger"><span class="glyphicon glyphicon-remove font20px"></span> Invalid username and password!</div >');
                }

                // hide loader
                $("#wait").addClass("hide");

            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
}

function openDefectModal(type) {
    $("#errMsgDiv, #messageDiv, #defectLink, #defectAreaLink, #subdefectAreaLink, #defectScreenList").empty();
    $(".defectAreaLink, #defectAreaScreen").removeClass('active');
    $("#defectAreaScreen").removeClass('in');
    $("#statusType").val(type);

    var barcode = $('#txtbarcode').val().trim();

    if (barcode == '' || barcode.length != 10) {
        var htm = '<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> Please enter valid barcode!</div >';
        $("#messageDiv").html(htm);

        return;
    }

    setTimeout(function () {
        $('#defectModal').modal({ backdrop: 'static', keyboard: false });
    }, 250);
}

function closeDefectModal() {
    $('#defectModal').modal('hide');
    $("#errMsgDiv").empty();
    $(".subDefectBtn").removeClass('activeSubDefectBtn');
    $("#txtbarcode").focus();
}

function openLogoutPopup() {
    $("#loginPwdMsg").empty();

    // Reset Previously enter password
    $("#login-password").val('');

    // Open logout modal after some delay so that confirm logout password field reset successfully
    setTimeout(function () {
        $('#logoutModal').modal({ backdrop: 'static', keyboard: false });
    }, 100);
}

function openChangePasswordModal() {
    $("#passwordMessageDiv").empty();

    // Reset Previously enter password
    $("#CurrentPassword, #NewPassword, #ConfirmPassword").val('');

    setTimeout(function () {
        $('#changePasswordModal').modal({ backdrop: 'static', keyboard: false });
    }, 100);
}

function ChangePasswordSave() {
    $("#passwordMessageDiv").empty();
    $("#CurrentPassword, #NewPassword, #ConfirmPassword").removeClass('borderRed');

    var error = 0;

    var CurrentPassword = $("#CurrentPassword").val().trim();
    var NewPassword = $("#NewPassword").val().trim();
    var ConfirmPassword = $("#ConfirmPassword").val().trim();

    if (CurrentPassword == '') {
        $("#CurrentPassword").addClass('borderRed');
        error = 1;
    }
    if (NewPassword == '') {
        $("#NewPassword").addClass('borderRed');
        error = 1;
    }
    if (ConfirmPassword == '') {
        $("#ConfirmPassword").addClass('borderRed');
        error = 1;
    }

    if (error == 1) {
        $("#passwordMessageDiv").html('<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> Please fill all fields! </div >');
        return;
    }

    if (NewPassword != ConfirmPassword) {
        $("#passwordMessageDiv").html('<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> New password and confirm password is not matched!</div >');
        return;
    }

    if (NewPassword.length < 4) {
        $("#passwordMessageDiv").html('<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> Your new password should have atleast 4 characters long!</div >');
        return;
    }

    $.ajax(
        {
            url: "http://" + URL + "/CTPWebAPI/api/CommonController/changePassword",
            type: 'post',
            data: "{CurrentPassword: '" + CurrentPassword + "', NewPassword: '" + NewPassword + "', manningID:'" + sessionStorage.getItem("manningID") + "'}",
            datatype: 'jsonp',
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = JSON.parse(response);

                if (data == "1") {
                    $("#passwordMessageDiv").html('<div class="text-success"><span class="glyphicon glyphicon-ok font20px"></span> Password changed successfully!</div >');
                }
                else if (data == "-1") {
                    $("#passwordMessageDiv").html('<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> Please fill all fields!</div >');
                }
                else if (data == "-2") {
                    $("#passwordMessageDiv").html('<div class="text-danger"><span class="glyphicon glyphicon-remove font20px"></span> Please enter correct current password!</div >');
                }
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
}

function logout() {
    $.ajax(
    {
        url: "http://" + URL + "/CTPWebAPI/api/CommonController/updateWorkCenterForLogoutUser",
        type: 'post',
        data: "{wcID:'" + sessionStorage.getItem("wcID") + "'}",
        datatype: 'jsonp',
        crossDomain: true,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var data = response;

            if (data == "1") {
                sessionStorage.clear();
                location.reload();
            }
        },
        error: function (xhr, status, error) {
            console.log(error);
        }
    });
}

function autoLogoutFunc() {
    sessionStorage.clear();
    location.reload();
}

function autoLogout() {
    $.ajax(
        {
            url: "http://" + URL + "/CTPWebAPI/api/CommonController/getTime",
            type: 'get',
            datatype: 'jsonp',
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = response;
                var timeArr = data.split(":");

                if (timeArr[0] != undefined && timeArr[1] != undefined && timeArr[2] != undefined) {
                    var timeArrNew = [parseInt(timeArr[0]), parseInt(timeArr[1]), parseInt(timeArr[2])];
                    //console.log(timeArrNew);

                    // A shift
                    if (timeArrNew[0] == 7 && timeArrNew[1] == 0 && timeArrNew[2] < 20) {
                        updateWCAfterAutoLogout();
                    }
                    // B shift
                    if (timeArrNew[0] == 15 && timeArrNew[1] == 0 && timeArrNew[2] < 20) {
                        updateWCAfterAutoLogout();
                    }
                    // C shift
                    if (timeArrNew[0] == 23 && timeArrNew[1] == 0 && timeArrNew[2] < 20) {
                        updateWCAfterAutoLogout();
                    }
                }
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
}

function updateWCAfterAutoLogout() {
    $.ajax(
        {
            url: "http://" + URL + "/CTPWebAPI/api/CommonController/updateWCAfterAutoLogout",
            type: 'post',
            datatype: 'jsonp',
            crossDomain: true,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                var data = JSON.parse(response);

                if (data.length) {
                    autoLogoutFunc();
                }
            },
            error: function (xhr, status, error) {
                alert(error);
            }
        });
}