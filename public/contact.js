$(document).ready(function() {
    $("#contactForm").submit(() => {
      let token = $('[name="g-recaptcha-response"]').val();
      let body = $('[name="body"]').val();
      let email = $('[name="email"]').val();

      var url = "https://h3mjkpagf4.execute-api.us-west-2.amazonaws.com/default/contactForm?email=" +
          encodeURIComponent(email) +
          "&body=" + encodeURIComponent(body) +
          "&recaptcha-token=" + encodeURIComponent(token);


      console.log("attempting to send: " + url);

      var request = new XMLHttpRequest();
      request.onload = function (e) {
        if (request.status != 200) {
            alert("error: " + request.responseText);
            return;
        }
        $("#sending").html("Your message was sent.");
      };
      request.onerror = function (e) {
        $("#sending").html("error: " + request.responseText);
      };
      request.open("Post", url, true);
      request.send();
      $("#contactForm").hide();
      $("#sending").show();

      return false;
    });


  grecaptcha.ready(function() {
    grecaptcha.execute('6LdBBYgUAAAAADy7n4m4jzGFHxgL6D4MLhvELITY', {action: 'contact'}).
      then(function(token) {
        $('input[name="g-recaptcha-response"]').val(token)
    });
  });
});