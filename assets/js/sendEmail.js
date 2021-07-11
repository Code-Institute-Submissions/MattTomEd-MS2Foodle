function sendMail(contactForm) {

    emailjs.send("service_jeegd06", "TEMPLATE_EMAIL", {
            from_name: $("#contact-form")[0][0].value,
            message: $("#contact-form")[0][3].value,
            issue: $("#contact-form")[0][2].value,
            from_email: $("#contact-form")[0][1].value,
        }
    ).then(
        function (response) {
            alert("Your message has been sent successfully!", response)
            return false
        },
        function (error) {
            console.log("Email sending fail ", error)
            return false
        }
    );
    return false
}