var devKPI = {
    'Nikita Evdokimenko': 0.85,
    'Eugene Novikov': 0.92,
};

var averageSprintQuality = 50;

var getKPI = function(devName) {
    if (devKPI.hasOwnProperty(devName))
        return devKPI[devName];
    else
        throw new Error("user was not found");
};

var getSprintCodeQuaility = function(codeQuality, lengthOfSprint) {
    if (lengthOfSprint > 0)
        return codeQuality / lengthOfSprint;
    else
        throw new Error("length of sprint should be positive");
};

var getQuestionRating = function(sprintCodeQuality, KPI) {
    return sprintCodeQuality * KPI * 100;
};

var showSprintStatus = function(questionRating, selector) {
    var sprintStatusContainer = $(selector);
    var html = '<label> Sprint status </label>';

    switch (true) {
        case questionRating < averageSprintQuality:
            html += '<div class="alert alert-danger"> Low sprint quality </div>';
            break;
        case questionRating == averageSprintQuality:
            html += '<div class="alert alert-info"> Medium sprint quality </div>';
            break;
        case questionRating > averageSprintQuality:
            html += '<div class="alert alert-success"> High sprint quality </div>';
            break;
    }

    sprintStatusContainer.html(html);
};
