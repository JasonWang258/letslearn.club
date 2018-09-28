import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/plugins/i18nMessages'

Vue.use(VueI18n)
// Create VueI18n instance with options
let locale = 'en'
if (navigator.languages) {
  locale = navigator.languages.includes('zh-CN') ? 'zh-cn' : 'en'
}
const i18n = new VueI18n({
  locale, // set locale
  fallbackLocale: 'en',
  messages // set locale messages
})
export default i18n
