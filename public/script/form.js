$(document).ready(function () {
    var slider = new Slider("#codeQuality");
    slider.on("slide", function (sliderValue) {
        document.getElementById("codeQualitySliderVal").textContent = sliderValue;
    });

    $('#questionnaireForm').on('submit', function(){
        var formData = $(this).serialize();
        
        $.post ('/submitForm', formData)
            .done(function(){
                console.log('request has been successfully sent')
            })
            .fail(function(){
                console.log('Error sending the form')                
            });
    });
});