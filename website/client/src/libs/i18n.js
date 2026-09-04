// Vue plugin to globally expose a '$t' method that calls common/i18n.t.
// Can be anywhere inside vue as 'this.$t' or '$t' in templates.
import i18n from '@/../../common/script/i18n';
import cyberhabitsLocale from './cyberhabitsLocale';

function loadLocale (i18nData) {
  // Load Habitica's current runtime strings, then apply presentation-only
  // CyberHabits labels without changing backend identifiers.
  i18n.strings = {
    ...i18nData.strings,
    ...cyberhabitsLocale,
  };
}

export default {
  install (Vue, { i18nData }) {
    if (i18nData) loadLocale(i18nData);

    Vue.prototype.$loadLocale = loadLocale;

    Vue.prototype.$t = function translateString (...args) {
      return i18n.t.apply(null, [...args]);
    };
  },
};
