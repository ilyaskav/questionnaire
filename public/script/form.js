var devKPI = {
    'Nikita Evdokimenko': 0.85,
    'Eugene Novikov': 0.92,
};

var mediumSprintQuality = 50;

var getKPI = function(devName) {
    return devKPI.hasOwnProperty(devName) ? devKPI[devName] : undefined;
}

var showSprintStatus = function(questionRating) {
    var sprintStatusDiv = $('#sprintStatus');

    switch (true) {
        case questionRating < mediumSprintQuality:
            sprintStatusDiv.addClass('alert-danger');
            sprintStatusDiv.text('Bad sprint quality');
            break;
        case questionRating == mediumSprintQuality:
            sprintStatusDiv.addClass('alert-info');
            sprintStatusDiv.text('Medium sprint quality');
            break;
        case questionRating > mediumSprintQuality:
            sprintStatusDiv.addClass('alert-success');
            sprintStatusDiv.text('High sprint quality');
            break;
    }

    sprintStatusDiv.parent().show();
}

$(document).ready(function() {
    $('#navbar li').eq(1).addClass('active');
    $('#sprintStatus').parent().hide();

    $('#questionnaireForm').on('submit', function(e) {
        e.preventDefault();
        var form = $('#questionnaireForm');
        var formData = {};

        form.serializeArray().map(function(x) { formData[x.name] = x.value; });

        var sprintCodeQuality = formData.codeQuality / formData.lengthOfSprint;
        var questionRating = sprintCodeQuality * getKPI(formData.bestDev) * 100;

        showSprintStatus(questionRating);

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