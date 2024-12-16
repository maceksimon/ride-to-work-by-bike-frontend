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
   * Transform merchandise data into FormCardMerchType format
   * individually for each product ID.
   * This is used to render merchandise options in form fields
   * where each product (ID) holds information about its available variants.
   */
  const merchandiseById = computed<FormCardMerchType[]>(() => {
    // transform items grouped by name into FormCardMerchType
    return merchandise.value.map((item): FormCardMerchType => {
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
          value: variant.id.toString(),
        }));

      /**
       * Create dialog image array from t_shirt_preview
       * This will be shown in the merchandise dialog
       */
      const dialogImages: Image[] = [
        {
          src: item.t_shirt_preview,
          alt: item.name,
        },
      ];

      // return FormCardMerchType (value is the ID of the item)
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
   * Transform merchandise data into FormCardMerchType format
   * grouped by gender and then by name of the product.
   * This is used to display merchandise cards with composite data
   * showing information about all variants of the product of that name.
   */
  const merchandiseCards = computed<Record<Gender, FormCardMerchType[]>>(() => {
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

    // for each gender, group by name and transform to FormCardMerchType
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

        // transform each name group into FormCardMerchType
        acc[gender as Gender] = Object.entries(merchandiseGroupedByName).map(
          ([name, items]): FormCardMerchType => {
            // get first item as a reference for common properties
            const firstItem = items[0];

            // get all sizes available for this item name and gender
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
              value: name,
              image: firstItem.t_shirt_preview,
              material: firstItem.material,
              label: name,
              size: firstItem.size,
              sizeId: firstItem.id.toString(),
              itemIds: items.map((item) => item.id.toString()),
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

    merchandise.value = [
      {
        id: 133,
        name: 'Triko 2024',
        sex: 'female',
        size: 'XS',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2024, velikost XS.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 134,
        name: 'Triko 2024',
        sex: 'female',
        size: 'S',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2024, velikost S.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 135,
        name: 'Triko 2024',
        sex: 'female',
        size: 'M',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2024, velikost M.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 136,
        name: 'Triko 2024',
        sex: 'female',
        size: 'L',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2024, velikost L.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 137,
        name: 'Triko 2024',
        sex: 'female',
        size: 'XL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2024, velikost XL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 138,
        name: 'Triko 2024',
        sex: 'female',
        size: 'XXL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2024, velikost XXL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 139,
        name: 'Triko 2024',
        sex: 'male',
        size: 'S',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2024, velikost S.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 140,
        name: 'Triko 2024',
        sex: 'male',
        size: 'M',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2024, velikost M.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 141,
        name: 'Triko 2024',
        sex: 'male',
        size: 'L',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2024, velikost L.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 142,
        name: 'Triko 2024',
        sex: 'male',
        size: 'XL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2024, velikost XL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 143,
        name: 'Triko 2024',
        sex: 'male',
        size: 'XXL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2024, velikost XXL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 144,
        name: 'Triko 2024',
        sex: 'male',
        size: 'XXXL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2024, velikost XXXL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2024.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=4KKJp3eFkUpAim%2F4TT12TCpSiCE%3D&Expires=2049394751',
      },
      {
        id: 159,
        name: 'Triko 2023',
        sex: 'female',
        size: 'S',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2023, velikost S.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 160,
        name: 'Triko 2023',
        sex: 'female',
        size: 'M',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2023, velikost M.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 161,
        name: 'Triko 2023',
        sex: 'female',
        size: 'L',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2023, velikost L.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 162,
        name: 'Triko 2023',
        sex: 'female',
        size: 'XL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2023, velikost XL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 163,
        name: 'Triko 2023',
        sex: 'female',
        size: 'XXL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Dámske triko 2023, velikost XXL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 164,
        name: 'Triko 2023',
        sex: 'male',
        size: 'XS',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2023, velikost S.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 165,
        name: 'Triko 2023',
        sex: 'male',
        size: 'S',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2023, velikost M.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 166,
        name: 'Triko 2023',
        sex: 'male',
        size: 'M',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2023, velikost L.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 167,
        name: 'Triko 2023',
        sex: 'male',
        size: 'L',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2023, velikost XL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 168,
        name: 'Triko 2023',
        sex: 'male',
        size: 'XXL',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Pánske triko 2023, velikost XXL.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/triko_vizualizace_dpnk_2023.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=v%2BuNQYuB6hBoT%2F1K0fGMhNGbX1Y%3D&Expires=2049394751',
      },
      {
        id: 157,
        name: 'Tunel nákrčník',
        sex: 'unisex',
        size: '',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Tunel nákrčník',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/2022_n%C3%A1kr%C4%8Dn%C3%ADk_edited.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=sEzrHnEwIyIv0LIjXD6Q2n4w%2B1k%3D&Expires=2049394751',
      },
      {
        id: 170,
        name: '2024 ponožky',
        sex: 'unisex',
        size: '36-40',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Ponožky 2024, velikost 36-40.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/2024_dpnk_cernobile_ponozky.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=VPjQaK4Rrv9MS9COXt%2FMK8J0IVk%3D&Expires=2049394751',
      },
      {
        id: 171,
        name: '2024 ponožky',
        sex: 'unisex',
        size: '41-46',
        author: 'Auto*Mat',
        material: 'Bavlna',
        description: 'Ponožky 2024, velikost 41-46.',
        t_shirt_preview:
          'https://dpnk-test.s3.amazonaws.com/t_shirt_preview/2024_dpnk_cernobile_ponozky.jpg?AWSAccessKeyId=AKIAJ3R77G7P3TJECZ7Q&Signature=VPjQaK4Rrv9MS9COXt%2FMK8J0IVk%3D&Expires=2049394751',
      },
    ];

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
