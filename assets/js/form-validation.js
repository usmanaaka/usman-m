document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");

    form.addEventListener("submit", function(event) {
        // Prevent the form from submitting traditionally
        event.preventDefault();

        // Get form field values
        const name = document.getElementById("name").value;
        const email = document.getElementById("number").value;
        const message = document.getElementById("message").value;

        // Check if any required field is empty
        if (name === "") {
            alert("Please enter your name.");
            return; // Stop form submission if name is blank
        }
        if (email === "") {
            alert("Please enter your email.");
            return; // Stop form submission if email is blank
        }
        if (message === "") {
            alert("Please enter your message.");
            return; // Stop form submission if message is blank
        }
        //For Email button
        // Create a FormData object with the form data
        const formData = new FormData(form);

        // Send the form data to Formspree via fetch (AJAX)
        fetch("https://formspree.io/f/xwpkqnby", {
            method: "POST",
            body: formData
        })
        .then(response => {
            if (response.ok) {    
                window.location.href = "https://advanceinstitutes.com"; // Redirect to own page
            } else {
                alert("Your form has been successfully submitted!");
                location.reload();
            }
        })
        .catch(error => {
            alert("Your form has been submitted!");
            location.reload();
        });
    });
});


