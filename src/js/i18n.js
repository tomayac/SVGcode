/**
 * SVGcode—Convert raster images to SVG vector graphics
 * Copyright (C) 2021 Google LLC
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

const LOCAL_STORAGE_KEY = 'language';
const SUPPORTED_LANGUAGES = [
  'ar',
  'ca',
  'da',
  'de',
  'el',
  'en',
  'es',
  'fr',
  'he',
  'id',
  'ja',
  'ko',
  'nl',
  'no',
  'pl',
  'pt',
  'ru',
  'uk',
  'zh',
];

const SUPPORTED_LOCALES = [
  'ar-TN',
  'ca-ES',
  'da-DK',
  'de-DE',
  'el-GR',
  'en-GB',
  'en-US',
  'es-ES',
  'fr-FR',
  'he-IL',
  'id-ID',
  'ja-JP',
  'ko-KR',
  'nl-NL',
  'no-NO',
  'pl-PL',
  'pt-BR',
  'ru-RU',
  'uk-UA',
  'zh-CN',
];

const RTL_LANGUAGES = ['ar', 'fa', 'he', 'ur'];

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
    this.defaultLanguage = 'en';
    this.defaultLocale = 'US';
    this.translations = null;
    this.supportedLanguages = SUPPORTED_LANGUAGES;
    this.supportedLocales = SUPPORTED_LOCALES;
    this.currentLanguageAndLocale = this.detectOrRestoreLanguageAndLocale();
  }

  /**
   * @param  {} language
   * @param  {} locale
   */
  findBestMatchingLanguageAndLocale(language, locale) {
    if (locale) {
      // Safari reports the locale as lowercase:
      // https://bugs.webkit.org/show_bug.cgi?id=163096.
      locale = locale.toUpperCase();
    }
    // The desired language is unknown or not supported at all, so fall back to en-US.
    if (!language || !this.supportedLanguages.includes(language)) {
      language = this.defaultLanguage;
      locale = this.defaultLocale;
      // The desired locale is unknown or not supported, but the language is.
    } else if (
      !locale ||
      !this.supportedLocales.includes(`${language}-${locale}`)
    ) {
      locale = this.supportedLocales
        .find((supportedLocale) => supportedLocale.startsWith(`${language}-`))
        .split('-')[1];
    }
    return { language, locale };
  }

  /**
   *
   *
   * @returns
   * @memberof I18N
   */
  detectOrRestoreLanguageAndLocale() {
    // Use a `?lang=` query parameter to override the language, if available.
    const url = new URL(location);
    const urlSearchParams = url.searchParams;
    const langParam = urlSearchParams.get('lang');
    if (langParam) {
      urlSearchParams.delete('lang');
      history.pushState({}, '', url);
      const [paramLanguage, paramLocale = ''] = langParam.split('-');
      const { language, locale } = this.findBestMatchingLanguageAndLocale(
        paramLanguage,
        paramLocale,
      );
      this.setLanguageAndLocale(language, locale);
      return { language, locale };
    }

    // Use the stored language and locale, if available.
    const storedLanguage = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedLanguage) {
      const { language, locale } = JSON.parse(storedLanguage);
      this.setLanguageAndLocale(language, locale);
      return { language, locale };
    }

    // Use the browser's language and locale.
    const [navLanguage, navLocale = ''] = navigator.language?.split('-');
    const { language, locale } = this.findBestMatchingLanguageAndLocale(
      navLanguage,
      navLocale,
    );
    this.setLanguageAndLocale(language, locale);
    return { language, locale };
  }
  /**
   * @param  {} language
   * @param  {} locale
   */
  async setLanguageAndLocale(language, locale) {
    if (!this.supportedLanguages.includes(language)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      language = this.defaultLanguage;
      locale = this.defaultLocale;
    }
    if (locale && !this.supportedLocales.includes(`${language}-${locale}`)) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      language = this.defaultLanguage;
      locale = this.defaultLocale;
    }
    this.currentLanguageAndLocale = {
      language,
      locale,
    };
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(this.currentLanguageAndLocale),
    );
    document.documentElement.lang = `${language}${locale ? `-${locale}` : ''}`;
    if (RTL_LANGUAGES.includes(language)) {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    await this.getTranslations();
  }

  /**
   *
   *
   * @memberof I18N
   */
  async getTranslations() {
    const { language, locale } = this.currentLanguageAndLocale;
    this.translations = (
      await import(`../i18n/${language}${locale ? `-${locale}` : ''}.js`).catch(
        () => import(`../i18n/${this.defaultLocale}.js`),
      )
    ).default;
  }

  /**
   *
   *
   * @param {*} key
   * @returns
   * @memberof I18N
   */
  t(key) {
    return this.translations[key] || '⛔️ Missing translation';
  }
}

const i18n = new I18N();

export { i18n };
