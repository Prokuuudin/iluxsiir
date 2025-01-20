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

    // Сохранение выбранного языка в localStorage
    localStorage.setItem("selectedLanguage", language);

    // Обновление URL
    const url = new URL(window.location);
    url.searchParams.set("lang", language);
    window.history.replaceState(null, "", url);
  }

  // Установка языка из localStorage или URL
  function initializeLanguage() {
    const urlParams = new URLSearchParams(window.location.search);
    const savedLanguage = localStorage.getItem("selectedLanguage");
    const urlLanguage = urlParams.get("lang");

    // Приоритет: URL > localStorage > по умолчанию ("ru")
    const initialLanguage = urlLanguage || savedLanguage || "ru";

    // Установка радиокнопки
    const initialRadio = document.querySelector(`input[name="language"][value="${initialLanguage}"]`);
    if (initialRadio) {
      initialRadio.checked = true;
    }

    // Обновление языка
    updateLanguage(initialLanguage);
  }

  // Обработчики переключения языка
  radioButtons.forEach(radio => {
    radio.addEventListener("change", (event) => {
      if (event.target.checked) {
        updateLanguage(event.target.value);
      }
    });
  });

  // Инициализация языка при загрузке страницы
  initializeLanguage();
}

export default setLanguage;