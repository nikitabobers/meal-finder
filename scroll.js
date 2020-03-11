// Smooth Scrolling
$(document).ready(function() {
    $(".result-data").on("click", function(event) {
        console.log(event.target);
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;
            console.log(hash);
            $("html, body").animate(
                {
                    scrollTop: $(hash).offset().top
                },
                800
            );
        }
    });
});
