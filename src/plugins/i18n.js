import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from '@/plugins/i18nMessages'

Vue.use(VueI18n)
// Create VueI18n instance with options
const i18n = new VueI18n({
  locale: 'zhHans', // set locale
  fallbackLocale: 'en',
  messages // set locale messages
})
export default i18n
