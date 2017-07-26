var devKPI = {
    'Nikita Evdokimenko': 0.85,
    'Eugene Novikov': 0.92,
};

var mediumSprintQuality = 50;

var getKPI = function(devName) {
    return devKPI.hasOwnProperty(devName) ? devKPI[devName] : undefined;
};

var getSprintCodeQuaility =  function (codeQuality, lengthOfSprint) {
    return codeQuality / lengthOfSprint;
};

var getQuestionRating = function(sprintCodeQuality, KPI) {
    return sprintCodeQuality * KPI * 100;
};

var showSprintStatus = function(questionRating, selector) {
    var sprintStatusContainer = $(selector);
    var html = '<label> Sprint status </label>';

    switch (true) {
        case questionRating < mediumSprintQuality:
            html += '<div class="alert alert-danger"> Bad sprint quality </div>';
            break;
        case questionRating == mediumSprintQuality:
            html += '<div class="alert alert-info"> Medium sprint quality </div>';
            break;
        case questionRating > mediumSprintQuality:
            html += '<div class="alert alert-success"> High sprint quality </div>';
            break;
    }

    sprintStatusContainer.html(html);
};
