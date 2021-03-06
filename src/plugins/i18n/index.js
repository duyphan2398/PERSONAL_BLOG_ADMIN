import Vue from 'vue'
import VueI18n from 'vue-i18n'
import validationMessagesEnglish from 'vee-validate/dist/locale/en'
import validationMessagesJapanese from 'vee-validate/dist/locale/ja'

// import languages
import english from '../../languages/en'
import japanese from '../../languages/ja'
import { LOCALE } from '../../enum/locale.enum'

Vue.use(VueI18n)

const dictionary = {
  en: {
    format_tel: 'The {_field_} is wrong format',
    decimal: 'The {_field_} is wrong format',
    half_alphabet: 'The {_field_} is wrong format',
    youtube_valid: 'The {_field_} is wrong format',
    alpha_dot: '{_field_} is wrong format'
  },
  ja: {
    format_tel: '不正な形式になっています。',
    decimal: '不正な形式になっています。',
    half_alphabet: '不正な形式になっています。',
    youtube_valid: '不正な形式になっています。',
    alpha_dot: '{_field_}は英文字のみ使用できます'
  }
}

const messages = {
  english: { ...english, validation: { ...validationMessagesEnglish.messages, ...dictionary.en } },
  japanese: { ...japanese, validation: { ...validationMessagesJapanese.messages, ...dictionary.ja } }
}

const i18n = new VueI18n({
  locale: LOCALE.ja, // set locale
  messages,
  fallbackLocale: LOCALE.ja
})

export default i18n
