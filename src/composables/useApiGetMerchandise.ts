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
} from '../components/types/Merchandise';
import type { FormCardMerchType, FormOption } from '../components/types/Form';
import type { Image } from '../components/types/Image';

export type UseApiGetMerchandiseReturn = {
  merchandise: Ref<Merchandise[]>;
  merchandiseCards: Ref<Record<Gender, FormCardMerchType[]>>;
  merchandiseById: Ref<FormCardMerchType[]>;
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
   * Transform merchandise data into FormCardMerchType format
   * Each item contains its specific properties and all available variants
   */
  const merchandiseById = computed<FormCardMerchType[]>(() => {
    const merchandiseGroupedByName = merchandise.value.reduce(
      (acc, item) => {
        if (!acc[item.name]) {
          acc[item.name] = [];
        }
        acc[item.name].push(item);
        return acc;
      },
      {} as Record<string, Merchandise[]>,
    );

    // transform each item into FormCardMerchType with all its variants
    return merchandise.value.map((item): FormCardMerchType => {
      // get all items with the same name (variants)
      const variants = merchandiseGroupedByName[item.name];

      // get all unique genders available for this item name and size
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

      // get all sizes available for this item name and gender
      const sizeOptions: FormOption[] = variants
        .filter((variant) => variant.sex === item.sex)
        .map((variant) => ({
          label: variant.size,
          value: variant.id.toString(),
        }));

      // create dialog image array from t_shirt_preview
      const dialogImages: Image[] = [
        {
          src: item.t_shirt_preview,
          alt: item.name,
        },
      ];

      // return merchandise card (value is the name of the item)
      return {
        value: item.id.toString(),
        author: item.author,
        dialogDescription: item.description,
        dialogImages,
        dialogTitle: item.name,
        gender: item.sex,
        genderOptions,
        image: item.t_shirt_preview,
        material: item.material,
        label: item.name,
        size: item.size,
        sizeId: item.id.toString(),
        sizeOptions,
      };
    });
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

  /**
   * Transform merchandise data into FormCardMerchType format
   * Groups items by gender and name, transforms into required format
   */
  const merchandiseCards = computed<Record<Gender, FormCardMerchType[]>>(() => {
    // first group by gender
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

    // for each gender, group by name and transform
    return Object.entries(merchandiseGroupedByGender).reduce(
      (acc, [gender, genderItems]) => {
        // group items by name within this gender
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

        // transform each name group into FormCardMerchType
        acc[gender as Gender] = Object.entries(merchandiseGroupedByName).map(
          ([name, items]): FormCardMerchType => {
            // get first item as a reference for common properties
            const firstItem = items[0];

            // get all unique genders available for this item name
            const genderOptions: FormOption[] = [
              ...new Set(items.map((item) => item.sex)),
            ].map((sex) => ({
              label: getGenderLabel(sex),
              value: sex,
            }));

            // get all sizes available for this item name with unique size labels
            const sizeOptions: FormOption[] = items.map((item) => ({
              label: item.size,
              value: item.id.toString(),
            }));

            // create dialog image array from t_shirt_preview
            const dialogImages: Image[] = [
              {
                src: firstItem.t_shirt_preview,
                alt: name,
              },
            ];

            // return merchandise card (value is the name of the item)
            return {
              author: firstItem.author,
              dialogDescription: firstItem.description,
              dialogImages,
              dialogTitle: name,
              gender: firstItem.sex,
              genderOptions,
              value: name,
              image: firstItem.t_shirt_preview,
              material: firstItem.material,
              label: name,
              size: firstItem.size,
              sizeId: firstItem.id.toString(),
              sizeOptions,
            };
          },
        );

        return acc;
      },
      {} as Record<Gender, FormCardMerchType[]>,
    );
  });

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

  return {
    merchandise,
    merchandiseCards,
    merchandiseById,
    isLoading,
    loadMerchandise,
  };
};
