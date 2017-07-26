
$(document).ready(function() {
    $('#navbar li').eq(1).addClass('active');

    $('#questionnaireForm').on('submit', function(e) {
        e.preventDefault();
        var form = $('#questionnaireForm');
        var formData = {};

        form.serializeArray().map(function(x) { formData[x.name] = x.value; });

        var sprintCodeQuality = getSprintCodeQuaility (formData.codeQuality, formData.lengthOfSprint);
        var questionRating = getQuestionRating(sprintCodeQuality, getKPI(formData.bestDev));

        showSprintStatus(questionRating, '#sprintStatus');

        $.post('/submitForm', form.serialize(), 'json')
            .done(function() {
                $('.alert-success').show();
                form[0].reset();
            })
            .fail(function() {
                $('.alert-danger').show();
                console.log('Error sending the form')
            });
    });

});