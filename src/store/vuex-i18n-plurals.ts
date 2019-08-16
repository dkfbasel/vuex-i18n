// determine which pluralization form should be used
// for the given language given the respective number of items
export default function (languageCode: string, n: number | null): number {
  // initialize the number of items if not set
  if (n === undefined || n === null) n = 0;

  switch (languageCode) {
    case 'ay': // Aymará
    case 'bo': // Tibetan
    case 'cgg': // Chiga
    case 'dz': // Dzongkha
    case 'fa': // Persian
    case 'id': // Indonesian
    case 'ja': // Japanese
    case 'jbo': // Lojban
    case 'ka': // Georgian
    case 'kk': // Kazakh
    case 'km': // Khmer
    case 'ko': // Korean
    case 'ky': // Kyrgyz
    case 'lo': // Lao
    case 'ms': // Malay
    case 'my': // Burmese
    case 'sah': // Yakut
    case 'su': // Sundanese
    case 'th': // Thai
    case 'tt': // Tatar
    case 'ug': // Uyghur
    case 'vi': // Vietnamese
    case 'wo': // Wolof
    case 'zh': // Chinese
      // 1 form
      return 0;
    case 'is': // Icelandic
      // 2 forms
      return (n % 10 !== 1 || n % 100 === 11) ? 1 : 0;
    case 'jv': // Javanese
      // 2 forms
      return n !== 0 ? 1 : 0;
    case 'mk': // Macedonian
      // 2 forms
      return n === 1 || n % 10 === 1 ? 0 : 1;
    case 'ach': // Acholi
    case 'ak': // Akan
    case 'am': // Amharic
    case 'arn': // Mapudungun
    case 'br': // Breton
    case 'fil': // Filipino
    case 'fr': // French
    case 'gun': // Gun
    case 'ln': // Lingala
    case 'mfe': // Mauritian Creole
    case 'mg': // Malagasy
    case 'mi': // Maori
    case 'oc': // Occitan
    case 'pt_BR': // Brazilian Portuguese
    case 'tg': // Tajik
    case 'ti': // Tigrinya
    case 'tr': // Turkish
    case 'uz': // Uzbek
    case 'wa': // Walloon
    /* eslint-disable */
    /* Disable "Duplicate case label" because there are 2 forms of Chinese plurals */
    case 'zh':  // Chinese
      /* eslint-enable */
      // 2 forms
      return n > 1 ? 1 : 0;
    case 'lv': // Latvian
      // 3 forms
      return (n % 10 === 1 && n % 100 !== 11 ? 0 : n !== 0 ? 1 : 2);
    case 'lt': // Lithuanian
      // 3 forms
      return (n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    case 'be': // Belarusian
    case 'bs': // Bosnian
    case 'hr': // Croatian
    case 'ru': // Russian
    case 'sr': // Serbian
    case 'uk': // Ukrainian
      // 3 forms
      return (
        n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    case 'mnk': // Mandinka
      // 3 forms
      return (n === 0 ? 0 : n === 1 ? 1 : 2);
    case 'ro': // Romanian
      // 3 forms
      return (n === 1 ? 0 : (n === 0 || (n % 100 > 0 && n % 100 < 20)) ? 1 : 2);
    case 'pl': // Polish
      // 3 forms
      return (n === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
    case 'cs': // Czech
    case 'sk': // Slovak
      // 3 forms
      return (n === 1) ? 0 : (n >= 2 && n <= 4) ? 1 : 2;
    case 'csb': // Kashubian
      // 3 forms
      return (n === 1) ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
    case 'sl': // Slovenian
      // 4 forms
      return (n % 100 === 1 ? 0 : n % 100 === 2 ? 1 : n % 100 === 3 || n % 100 === 4 ? 2 : 3);
    case 'mt': // Maltese
      // 4 forms
      return (n === 1 ? 0 : n === 0 || (n % 100 > 1 && n % 100 < 11) ? 1 : (n % 100 > 10 && n % 100 < 20) ? 2 : 3);
    case 'gd': // Scottish Gaelic
      // 4 forms
      return (n === 1 || n === 11) ? 0 : (n === 2 || n === 12) ? 1 : (n > 2 && n < 20) ? 2 : 3;
    case 'cy': // Welsh
      // 4 forms
      return (n === 1) ? 0 : (n === 2) ? 1 : (n !== 8 && n !== 11) ? 2 : 3;
    case 'kw': // Cornish
      // 4 forms
      return (n === 1) ? 0 : (n === 2) ? 1 : (n === 3) ? 2 : 3;
    case 'ga': // Irish
      // 5 forms
      return n === 1 ? 0 : n === 2 ? 1 : (n > 2 && n < 7) ? 2 : (n > 6 && n < 11) ? 3 : 4;
    case 'ar': // Arabic
      // 6 forms
      return (n === 0 ? 0 : n === 1 ? 1 : n === 2 ? 2 : n % 100 >= 3 && n % 100 <= 10 ? 3 : n % 100 >= 11 ? 4 : 5);
    default: // Everything else
      return n !== 1 ? 1 : 0;
  }
}
