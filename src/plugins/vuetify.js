import Vue from 'vue'

import {
  Vuetify,
  VApp,
  VNavigationDrawer,
  VFooter,
  VList,
  VBtn,
  VIcon,
  VGrid,
  VToolbar,
  VMenu,
  VCard,
  VDivider,
  VAvatar,
  VTooltip,
  VForm,
  VTextField,
  VTextarea,
  VCheckbox,
  VProgressCircular,
  VSnackbar,
  VExpansionPanel,
  VSelect,
  VChip,
  VBadge,
  VImg,
  VHover,
  VRating,
  VDialog,
  VBottomSheet,
  VProgressLinear,
  transitions
} from 'vuetify'
import 'vuetify/src/stylus/app.styl'
import i18n from '@/plugins/i18n'
Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VList,
    VBtn,
    VIcon,
    VGrid,
    VToolbar,
    VMenu,
    VCard,
    VDivider,
    VAvatar,
    VTooltip,
    VForm,
    VTextField,
    VTextarea,
    VCheckbox,
    VProgressCircular,
    VSnackbar,
    VExpansionPanel,
    VSelect,
    VChip,
    VBadge,
    VImg,
    VHover,
    VRating,
    VDialog,
    VBottomSheet,
    VProgressLinear,
    transitions
  },
  theme: {
    primary: '#7986CB',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  lang: {
    t: (key, ...params) => i18n.t(key, params)
  }
})
