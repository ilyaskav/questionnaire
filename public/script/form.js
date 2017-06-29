$(document).ready(function () {
    var slider = new Slider("#codeQuality");
    slider.on("slide", function (sliderValue) {
        document.getElementById("codeQualitySliderVal").textContent = sliderValue;
    });

    $('#questionnaireForm').on('submit', function(e){
        e.preventDefault();
        var form = $('#questionnaireForm');
        var formData = form.serialize();
        
        $.post ('/submitForm', formData, 'json')
            .done(function(){
                $('.alert').show();
                form[0].reset();
                console.log('request has been successfully sent')
            })
            .fail(function(){
                console.log('Error sending the form')                
            });
    });
});