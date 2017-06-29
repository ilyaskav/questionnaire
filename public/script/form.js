

$(document).ready(function () {
    $('#navbar li').eq(1).addClass('active');

    $('#questionnaireForm').on('submit', function (e) {
        e.preventDefault();
        var form = $('#questionnaireForm');
        var formData = form.serialize();

        $.post('/submitForm', formData, 'json')
            .done(function () {
                $('.alert-success').show();
                form[0].reset();
                console.log('Request has been successfully sent')
            })
            .fail(function () {
                $('.alert-danger').show();
                console.log('Error sending the form')
            });
    });

    
});