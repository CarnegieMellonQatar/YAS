
function customAlert(string) {
    $("body").append('<div class="custom-alert animated fadeInRightBig">' + string + '</div>');
    setTimeout(function() {
        $(".custom-alert").remove();
    }, 3000);
}