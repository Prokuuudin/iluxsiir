function sendContactsForm() {
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("form");
        const formMessage = document.createElement("div");
        formMessage.className = "form-message";
        form.appendChild(formMessage);
    
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            formMessage.innerHTML = "";
            formMessage.style.color = "black";
    
            const formData = new FormData(form);
    
            try {
                const response = await fetch("/send.php", {
                    method: "POST",
                    body: formData,
                });
                
                const result = await response.json();
                
                console.log(result);
                
                if (result.success) {
                    formMessage.style.color = "green";
                    formMessage.innerText = result.message;
                    form.reset();
                    grecaptcha.reset();
                } else {
                    formMessage.style.color = "red";
                    formMessage.innerHTML = result.errors.map(err => `<p>${err}</p>`).join('');
                }
            } catch (error) {
                formMessage.style.color = "red";
                formMessage.innerText = "An error occurred while submitting the form. Please try again later.";
            }
        });
    });    
    
}

export default sendContactsForm;
