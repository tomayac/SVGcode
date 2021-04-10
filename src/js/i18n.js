import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export default (async () => {
  await i18next.use(LanguageDetector).init({
    order: ['querystring', 'navigator'],
    lookupQuerystring: 'lang',
    debug: true,
    resources: {
      en: {
        translation: {
          red: '🔴 Red',
          green: '🟢 Green',
          blue: '🔵 Blue',
          alpha: '𝝰 Alpha',
        },
      },
      de: {
        translation: {
          red: '🔴 Rot',
          green: '🟢 Grün',
          blue: '🔵 Blau',
          alpha: '𝝰 Alpha',
        },
      },
    },
  });
  return i18next;
})();
