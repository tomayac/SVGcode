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
const SUPPORTED_LANGUAGES = ['en', 'de', 'el', 'zh'];
const SUPPORTED_LOCALES = ['en-US', 'de-DE', 'el-GR', 'zh-CN'];

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
    this.defaultLocale = SUPPORTED_LOCALES[0];
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
    if (locale) {
      // Safari reports the locale as lowercase:
      // https://bugs.webkit.org/show_bug.cgi?id=163096.
      locale = locale.toUpperCase();
    }
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
    return this.translations[key];
  }
}

const i18n = new I18N();

export { i18n };
