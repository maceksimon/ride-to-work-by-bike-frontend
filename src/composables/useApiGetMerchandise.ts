// libraries
import { computed, ref } from 'vue';

// composables
import { useApi } from './useApi';
import { i18n } from '../boot/i18n';

// config
import { rideToWorkByBikeConfig } from '../boot/global_vars';

// stores
import { useLoginStore } from '../stores/login';

// types
import type { Ref } from 'vue';
import type { Logger } from '../components/types/Logger';
import type {
  Merchandise,
  GetMerchandiseResponse,
  MerchandiseCard,
  MerchandiseItem,
} from '../components/types/Merchandise';
import type { FormOption } from '../components/types/Form';
import type { Image } from '../components/types/Image';

export type UseApiGetMerchandiseReturn = {
  merchandise: Ref<Merchandise[]>;
  merchandiseCards: Ref<Record<Gender, MerchandiseCard[]>>;
  merchandiseItems: Ref<MerchandiseItem[]>;
  isLoading: Ref<boolean>;
  loadMerchandise: () => Promise<void>;
};

// enums
import { Gender } from '../components/types/Profile';

// utils
import { requestDefaultHeader, requestTokenHeader } from '../utils';

/**
 * Get merchandise composable
 * Used to getting API merchandise data
 * @param logger - Logger
 * @returns {UseApiGetMerchandiseReturn}
 */
export const useApiGetMerchandise = (
  logger: Logger | null,
): UseApiGetMerchandiseReturn => {
  const merchandise = ref<Merchandise[]>([]);
  const isLoading = ref<boolean>(false);
  const loginStore = useLoginStore();
  const { apiFetch } = useApi();

  /**
   * Load merchandise
   * Fetches merchandise data
   */
  const loadMerchandise = async (): Promise<void> => {
    // reset data
    logger?.debug(
      `Reseting merchandise data <${JSON.stringify(merchandise.value, null, 2)}>.`,
    );
    merchandise.value = [];
    logger?.debug(
      `Merchandise data reset to <${JSON.stringify(merchandise.value, null, 2)}>.`,
    );

    // get merchandise
    logger?.info('Get merchandise from the API.');
    isLoading.value = true;

    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch merchandise
    const { data } = await apiFetch<GetMerchandiseResponse>({
      endpoint: `${rideToWorkByBikeConfig.urlApiMerchandise}`,
      method: 'get',
      translationKey: 'getMerchandise',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    if (data?.results?.length) {
      merchandise.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }

    isLoading.value = false;
  };

  /**
   * Fetch next page of merchandise
   * @param {string} url - Get merchandise next page API URL
   * @returns {Promise<void>} - Promise
   */
  const fetchNextPage = async (url: string): Promise<void> => {
    logger?.debug(`Fetching next page of merchandise from <${url}>.`);
    // append access token into HTTP header
    const requestTokenHeader_ = { ...requestTokenHeader };
    requestTokenHeader_.Authorization += loginStore.getAccessToken;

    // fetch next page
    const { data } = await apiFetch<GetMerchandiseResponse>({
      endpoint: url,
      method: 'get',
      translationKey: 'getMerchandise',
      showSuccessMessage: false,
      headers: Object.assign(requestDefaultHeader(), requestTokenHeader_),
      logger,
    });

    // store results
    if (data?.results?.length) {
      merchandise.value.push(...data.results);
    }

    // if data has multiple pages, fetch all pages
    if (data?.next) {
      await fetchNextPage(data.next);
    }
  };

  const merchandiseGroupedByName = computed(() => {
    return merchandise.value.reduce(
      (acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = [];
        }
        acc[item.name].push(item);
        return acc;
      },
      {} as Record<string, Merchandise[]>,
    );
  });

  /**
   * Transform merchandise data into MerchandiseItem format
   * individually for each product ID.
   * This is used to render merchandise options in form fields
   * where each product (ID) holds information about its available variants.
   */
  const merchandiseItems = computed<MerchandiseItem[]>(() => {
    // transform items grouped by name into MerchandiseItem
    return merchandise.value.map((item): MerchandiseItem => {
      // get all items with the same name (variants)
      const variants = merchandiseGroupedByName.value[item.name];

      /**
       * Get all unique genders available for this item name and size.
       * These will determine the option values for the gender select.
       */
      const genderOptions: FormOption[] = [
        ...new Set(
          variants
            .filter((variant) => variant.size === item.size)
            .map((variant) => variant.sex),
        ),
      ].map((sex) => ({
        label: getGenderLabel(sex),
        value: sex,
      }));

      /**
       * Get all sizes available for this item name and gender.
       * These will determine the option values for the size select.
       */
      const sizeOptions: FormOption[] = variants
        .filter((variant) => variant.sex === item.sex)
        .map((variant) => ({
          label: variant.size,
          value: variant.id,
        }));

      // create image array from t_shirt_preview
      const images: Image[] = [
        {
          src: item.t_shirt_preview,
          alt: item.name,
        },
      ];

      // return MerchandiseItem
      return {
        id: item.id,
        label: item.name,
        gender: item.sex,
        genderOptions,
        size: item.size,
        sizeOptions,
        description: item.description,
        images,
      };
    });
  });

  /**
   * Transform merchandise data into MerchandiseCard format
   * grouped by gender and then by name of the product.
   * This is used to display merchandise cards with composite data
   * showing information about all variants of the product of that name.
   */
  const merchandiseCards = computed<Record<Gender, MerchandiseCard[]>>(() => {
    // group merchandise by gender
    const merchandiseGroupedByGender = merchandise.value.reduce(
      (acc, item) => {
        if (!acc[item.sex as Gender]) {
          acc[item.sex as Gender] = [];
        }
        acc[item.sex as Gender].push(item);
        return acc;
      },
      {} as Record<Gender, Merchandise[]>,
    );

    // for each gender, group by name and transform to MerchandiseCard
    return Object.entries(merchandiseGroupedByGender).reduce(
      (acc, [gender, genderItems]) => {
        /**
         * Group merchandise by name within given gender
         * This is done to distinguish between size options for each gender.
         */
        const merchandiseGroupedByName = genderItems.reduce(
          (nameAcc, item) => {
            if (!nameAcc[item.name]) {
              nameAcc[item.name] = [];
            }
            nameAcc[item.name].push(item);
            return nameAcc;
          },
          {} as Record<string, Merchandise[]>,
        );

        // transform each name group into MerchandiseCard
        acc[gender as Gender] = Object.entries(merchandiseGroupedByName).map(
          ([name, items]): MerchandiseCard => {
            // get first item as a reference for common properties
            const firstItem = items[0];

            // get all sizes available for this item name and gender
            const sizeOptions: FormOption[] = items.map((item) => ({
              label: item.size,
              value: item.id,
            }));

            // return MerchandiseCard
            return {
              label: name,
              image: firstItem.t_shirt_preview,
              description: firstItem.description,
              gender: firstItem.sex,
              material: firstItem.material,
              itemIds: items.map((item) => item.id),
              sizeOptions,
            };
          },
        );

        return acc;
      },
      {} as Record<Gender, MerchandiseCard[]>,
    );
  });

  /**
   * Get gender label
   * @param {Gender} gender - Gender
   * @returns {string} - Gender label
   */
  const getGenderLabel = (gender: Gender) => {
    switch (gender) {
      case Gender.female:
        return i18n.global.t('global.female');
      case Gender.male:
        return i18n.global.t('global.male');
      default:
        return i18n.global.t('global.unisex');
    }
  };

  return {
    merchandise,
    merchandiseCards,
    merchandiseItems,
    isLoading,
    loadMerchandise,
  };
};
