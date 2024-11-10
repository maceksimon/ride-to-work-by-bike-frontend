// libraries
import { computed } from 'vue';

// composables
import { i18n } from '../boot/i18n';

export const useLocale = () => {
  const localeWithCountry = computed(() => {
    switch (i18n.global.locale) {
      case 'cs':
        return 'cs_CZ';
      case 'sk':
        return 'sk_SK';
      default:
        return 'en_US';
    }
  });

  return {
    localeWithCountry,
  };
};
