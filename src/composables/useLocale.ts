// libraries
import { computed } from 'vue';

// composables
import { i18n } from '../boot/i18n';

// enum
import { LocaleLangCode } from '../components/types/Locale';

export const useLocale = () => {
  const localeWithCountry = computed(() => {
    switch (i18n.global.locale) {
      case 'cs':
        return LocaleLangCode.cs;
      case 'sk':
        return LocaleLangCode.sk;
      default:
        return LocaleLangCode.en;
    }
  });

  return {
    localeWithCountry,
  };
};
