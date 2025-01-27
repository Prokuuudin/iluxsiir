function sendContactsForm() {
  document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("form");
      const nameInput = document.getElementById("formName");
      const emailInput = document.getElementById("formEmail");
      const telInput = document.getElementById("formTel");
      const agreementInput = document.getElementById("formAgreement");

      // Функция для отображения ошибки
      const showError = (input) => {
          input.classList.add("_error");
          if (input.type === "checkbox") {
              input.closest(".form-group").classList.add("_error");
          }
      };

      // Функция для очистки ошибок
      const clearErrors = (input) => {
          input.classList.remove("_error");
          if (input.type === "checkbox") {
              input.closest(".form-group").classList.remove("_error");
          }
      };

      // Проверка имени
      const validateName = () => {
          const name = nameInput.value.trim();
          clearErrors(nameInput);
          if (name === "") {
              showError(nameInput);
              return false;
          }
          return true;
      };

      // Проверка email
      const validateEmail = () => {
          const email = emailInput.value.trim();
          clearErrors(emailInput);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (email === "" || !emailRegex.test(email)) {
              showError(emailInput);
              return false;
          }
          return true;
      };

      // Проверка телефона
      const validateTel = () => {
          const tel = telInput.value.trim();
          clearErrors(telInput);
          const telRegex = /^\+?[0-9]{10,15}$/;
          if (tel === "" || !telRegex.test(tel)) {
              showError(telInput);
              return false;
          }
          return true;
      };

      // Проверка чекбокса согласия
      const validateAgreement = () => {
          clearErrors(agreementInput);
          if (!agreementInput.checked) {
              showError(agreementInput);
              return false;
          }
          return true;
      };

      // Проверка reCAPTCHA
      const validateRecaptcha = () => {
          const recaptchaResponse = grecaptcha.getResponse();
          return recaptchaResponse !== "";
      };

      // Валидация формы
      const validateForm = () => {
          const isNameValid = validateName();
          const isEmailValid = validateEmail();
          const isTelValid = validateTel();
          const isAgreementValid = validateAgreement();
          const isRecaptchaValid = validateRecaptcha();

          if (!isNameValid || !isEmailValid || !isTelValid || !isAgreementValid || !isRecaptchaValid) {
              alert("Please, fill in all the required fields correctly!");
              return false;
          }

          return true;
      };

      // Отправка формы
      form.addEventListener("submit", async (e) => {
          e.preventDefault();
          clearErrors(nameInput);
          clearErrors(emailInput);
          clearErrors(telInput);
          clearErrors(agreementInput);

          if (validateForm()) {
              const formData = new FormData(form);
              try {
                  const response = await fetch("https://your-server-endpoint.com/submit", {
                      method: "POST",
                      body: formData,
                  });

                  if (response.ok) {
                      alert("Form submitted successfully!");
                      form.reset(); // Очистка формы
                      grecaptcha.reset(); // Сброс reCAPTCHA
                  } else {
                      alert("An error occurred while submitting the form. Try again.");
                  }
              } catch (error) {
                  console.error("Error:", error);
                  alert("Connection error.");
              }
          }
      });
  });
}

export default sendContactsForm;
