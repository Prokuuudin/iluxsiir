function sendContactsForm() {
    document.addEventListener("DOMContentLoaded", () => {
        const form = document.getElementById("form");
        const nameInput = document.getElementById("formName");
        const emailInput = document.getElementById("formEmail");
        const telInput = document.getElementById("formTel");
        const agreementInput = document.getElementById("formAgreement");
      
        // Определение языка из URL
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get("lang") || "ru"; // Язык по умолчанию - русский
      
        // Объект с переводами
        const translations = {
          ru: {
            nameRequired: "Введите ваше имя",
            emailRequired: "Введите вашу почту",
            emailInvalid: "Введите корректный email",
            telRequired: "Введите ваш телефон",
            telInvalid: "Введите корректный телефон",
            agreementRequired: "Вы должны принять условия политики конфиденциальности",
            recaptchaRequired: "Пожалуйста, подтвердите, что вы не робот.",
            success: "Форма успешно отправлена!",
            error: "Произошла ошибка при отправке формы. Попробуйте снова.",
            connectionError: "Ошибка подключения к серверу.",
          },
          en: {
            nameRequired: "Enter your name",
            emailRequired: "Enter your email",
            emailInvalid: "Enter a valid email",
            telRequired: "Enter your phone number",
            telInvalid: "Enter a valid phone number",
            agreementRequired: "You must accept the terms of the privacy policy",
            recaptchaRequired: "Please confirm you are not a robot.",
            success: "Form submitted successfully!",
            error: "An error occurred while submitting the form. Try again.",
            connectionError: "Connection error.",
          },
          ee: {
            nameRequired: "Sisestage oma nimi",
            emailRequired: "Sisestage oma e-post",
            emailInvalid: "Sisestage kehtiv e-post",
            telRequired: "Sisestage oma telefoninumber",
            telInvalid: "Sisestage kehtiv telefoninumber",
            agreementRequired: "Peate nõustuma privaatsuspoliitika tingimustega",
            recaptchaRequired: "Palun kinnitage, et te ei ole robot.",
            success: "Vorm edukalt saadetud!",
            error: "Vormi saatmisel ilmnes tõrge. Proovige uuesti.",
            connectionError: "Ühenduse viga.",
          },
        };
      
        const t = translations[lang]; // Текущие переводы
      
        // Функция для отображения ошибки
        const showError = (input, message) => {
          input.classList.add("error");
          const errorLabel = document.createElement("span");
          errorLabel.classList.add("error-message");
          errorLabel.textContent = message;
          input.parentElement.appendChild(errorLabel);
        };
      
        // Функция для очистки ошибок
        const clearErrors = (input) => {
          input.classList.remove("error");
          const errorMessages = input.parentElement.querySelectorAll(".error-message");
          errorMessages.forEach((msg) => msg.remove());
        };
      
        // Проверка имени
        const validateName = () => {
          const name = nameInput.value.trim();
          clearErrors(nameInput);
          if (name === "") {
            showError(nameInput, t.nameRequired);
            return false;
          }
          return true;
        };
      
        // Проверка email
        const validateEmail = () => {
          const email = emailInput.value.trim();
          clearErrors(emailInput);
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (email === "") {
            showError(emailInput, t.emailRequired);
            return false;
          } else if (!emailRegex.test(email)) {
            showError(emailInput, t.emailInvalid);
            return false;
          }
          return true;
        };
      
        // Проверка телефона
        const validateTel = () => {
          const tel = telInput.value.trim();
          clearErrors(telInput);
          const telRegex = /^\+?[0-9]{10,15}$/;
          if (tel === "") {
            showError(telInput, t.telRequired);
            return false;
          } else if (!telRegex.test(tel)) {
            showError(telInput, t.telInvalid);
            return false;
          }
          return true;
        };
      
        // Проверка чекбокса согласия
        const validateAgreement = () => {
          clearErrors(agreementInput);
          if (!agreementInput.checked) {
            showError(agreementInput, t.agreementRequired);
            return false;
          }
          return true;
        };
      
        // Проверка reCAPTCHA
        const validateRecaptcha = () => {
          const recaptchaResponse = grecaptcha.getResponse();
          if (recaptchaResponse === "") {
            alert(t.recaptchaRequired);
            return false;
          }
          return true;
        };
      
        // Валидация формы
        const validateForm = () => {
          const isNameValid = validateName();
          const isEmailValid = validateEmail();
          const isTelValid = validateTel();
          const isAgreementValid = validateAgreement();
          const isRecaptchaValid = validateRecaptcha();
      
          return isNameValid && isEmailValid && isTelValid && isAgreementValid && isRecaptchaValid;
        };
      
        // Отправка формы
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          clearErrors(form);
      
          if (validateForm()) {
            const formData = new FormData(form);
            try {
              const response = await fetch("https://your-server-endpoint.com/submit", {
                method: "POST",
                body: formData,
              });
      
              if (response.ok) {
                alert(t.success);
                form.reset(); // Очистка формы
                grecaptcha.reset(); // Сброс reCAPTCHA
              } else {
                alert(t.error);
              }
            } catch (error) {
              console.error("Ошибка:", error);
              alert(t.connectionError);
            }
          }
        });
      });
      
}

export default sendContactsForm;
