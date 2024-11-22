document.addEventListener("DOMContentLoaded", () => {
    const whatsappButton = document.getElementById("whatsappButton");
  
    if (whatsappButton) {
      whatsappButton.addEventListener("click", (event) => {
        // Prevent form submission
        event.preventDefault();
  
        // Get values from form fields
        const name = document.getElementById("name").value;
        const number = document.getElementById("number").value;
        const message = document.getElementById("message").value;
  
  
        // Construct WhatsApp message
        const whatsappNumber = "923353398374"; // Replace with your WhatsApp number
        const whatsappMessage = `Hello Team,%0AName: ${encodeURIComponent(name)}%0APhone/Email: ${encodeURIComponent(number)}%0A%0AMessage: ${encodeURIComponent(message)}`;
  
        // Redirect to WhatsApp with prefilled message
        window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, "_blank");
      });
    }
  });