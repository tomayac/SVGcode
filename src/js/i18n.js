const LOCAL_STORAGE_KEY = 'language';
const SUPPORTED_LANGUAGES = ['en', 'de'];

/**
 *
 *
 * @class I18N
 */
class I18N {
  /**
   *Creates an instance of I18N.
   * @memberof I18N
   */
  constructor() {
    this.currentLanguageAndLocale = this.detectLanguageAndLocal();
    this.defaultLanguage = SUPPORTED_LANGUAGES[0];
    this.translations = null;
  }

  /**
   *
   *
   * @returns
   * @memberof I18N
   */
  detectLanguageAndLocal() {
    const storedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLanguage) {
      return JSON.parse(storedLanguage);
    }
    let [language, locale = null] = navigator.language?.split('-');
    if (!language || !SUPPORTED_LANGUAGES.includes(language)) {
      language = SUPPORTED_LANGUAGES[0];
    }
    const result = {
      language,
      locale,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
    return result;
  }

  /**
   *
   *
   * @memberof I18N
   */
  async getTranslations() {
    const { language, locale } = this.currentLanguageAndLocale;
    const translations = (await import(`../i18n/${language}${(locale ? `-${locale}` : '')}.js`)).default;
    this.translations = translations;
  }

  /**
   *
   *
   * @param {*} key
   * @returns
   * @memberof I18N
   */
  t(key) {
    return this.translations[key];
  }
}

export default I18N;
