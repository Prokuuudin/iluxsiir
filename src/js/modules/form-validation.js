// function sendContactsForm() {
//     "use strict"
   
//     document.addEventListener('DOMContentLoaded', function () {
//         const form = document.getElementById('form');
//         form.addEventListener('submit', formSend);

//         async function formSend(e) {
//             e.preventDefault();

//             let error = formValidate(form);

//             let formData = new FormData(form);

//             if (error === 0) {
//                 form.classList.add('_sending')
//                 let response = await fetch('sendmail.php', {
//                     method: 'POST',
//                     body: formData
//                 });
//                 if (response.ok) {
//                     let result = await response.json();
//                     alert(result.message);
//                     formPreview.innerHTML = '';
//                     form.reset();
//                     form.classList.remove('_sending');
//                 } else {
//                     alert('Ошибка!');
//                     form.classList.remove('_sending');
//                 }
//             } else {
//                 alert('Заполните обязательные поля');
//             }

//             function formValidate(form) {
//                 let error = 0;
//                 let formReq = document.querySelectorAll('._req');

//                 for (let index = 0; index < formReq.length; index++) {
//                     const input = formReq[index];
//                     formRemoveError(input);

//                     if (input.classList.contains('_email')) {
//                         if (emailTest(input)) {
//                             formAddError(input);
//                             error++;
//                         }
//                     } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
//                         formAddError(input);
//                         error++;
//                     } else {
//                         if (input.value === '') {
//                             formAddError(input);
//                             error++;
//                         }
//                     }
//                 }
//                 return error;
//             }
//             function formAddError(input) {
//                 input.parentElement.classList.add('_error');
//                 input.classList.add('_error');
//             }
//             function formRemoveError(input) {
//                 input.parentElement.classList.remove('_error');
//                 input.classList.remove('_error');
//             }
//             // Test email field function
//             function emailTest(input) {
//                 return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
//             }
//         }
//     });
// }

// export default sendContactsForm

function sendContactsForm() {
    "use strict"

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('form');
        const languageRadios = document.querySelectorAll('[data-key]');
        const messages = {
            ru: {
                success: 'Форма успешно отправлена!',
                error: 'Ошибка при отправке формы!',
                required: 'Заполните обязательные поля'
            },
            en: {
                success: 'Form submitted successfully!',
                error: 'Error submitting the form!',
                required: 'Please fill in the required fields correctly'
            },
            ee: {
                success: 'Vorm edukalt saadetud!',
                error: 'Vormi saatmisel ilmnes viga!',
                required: 'Palun täitke nõutud väljad'
            }
        };

        let currentLang = 'ru'; // Язык по умолчанию

        // Обновление текущего языка при выборе радиокнопки
        languageRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    currentLang = radio.dataset.key;
                }
            });
        });

        form.addEventListener('submit', formSend);

        async function formSend(e) {
            e.preventDefault();

            let error = formValidate(form);
            let formData = new FormData(form);

            if (error === 0) {
                form.classList.add('_sending');
                try {
                    let response = await fetch('sendmail.php', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        let result = await response.json();
                        alert(messages[currentLang].success);
                        form.reset(); // Сброс формы
                        form.classList.remove('_sending');
                    } else {
                        alert(messages[currentLang].error);
                        form.classList.remove('_sending');
                    }
                } catch (error) {
                    alert(messages[currentLang].error);
                    form.classList.remove('_sending');
                }
            } else {
                alert(messages[currentLang].required);
            }
        }

        function formValidate(form) {
            let error = 0;
            let formReq = document.querySelectorAll('._req');

            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                formRemoveError(input);

                if (input.classList.contains('_email')) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
                    formAddError(input);
                    error++;
                } else {
                    if (input.value === '') {
                        formAddError(input);
                        error++;
                    }
                }
            }
            return error;
        }

        function formAddError(input) {
            input.parentElement.classList.add('_error');
            input.classList.add('_error');
        }

        function formRemoveError(input) {
            input.parentElement.classList.remove('_error');
            input.classList.remove('_error');
        }

        function emailTest(input) {
            return !/^\w+([\.-]?\w+)*@[\w-]+(\.[\w-]{2,8})+$/.test(input.value);
        }
    });
}

export default sendContactsForm;
