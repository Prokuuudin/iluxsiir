import translations from "../../html/data/translations";

function setLanguage() {

  const radioButtons = document.querySelectorAll('input[name="language"]');
  // Функция для обновления текстовых элементов
  function updateLanguage(language) {
    // Обновление текста для элементов с data-key
    document.querySelectorAll("[data-key]").forEach(el => {
      const key = el.getAttribute("data-key");
      if (translations[language][key]) {
        el.textContent = translations[language][key];
      }
    
    });

   
      
  
    
    // Обновление плейсхолдеров для элементов с data-placeholder-key
    document.querySelectorAll("[data-placeholder-key]").forEach(el => {
      const key = el.getAttribute("data-placeholder-key");
      if (translations[language][key]) {
        el.setAttribute("placeholder", translations[language][key]);
      }
    });
  }

  // Обработчики переключения языка
  radioButtons.forEach(radio => {
    radio.addEventListener("change", (event) => {
      if (event.target.checked) {
        updateLanguage(event.target.value);
      }
    });
  });

  // Функция для показа алерта
  function showAlert() {
    const currentLanguage = document.querySelector('input[name="language"]:checked').value;
    alert(translations[currentLanguage]["alert-message"]);
  }

  // Установка языка по умолчанию
  updateLanguage("ru");
}
export default setLanguage