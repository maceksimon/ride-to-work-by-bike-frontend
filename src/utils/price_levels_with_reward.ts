import { getCurrentDateTimeAccordingTimezone } from './index';
import type { PriceLevel } from '../components/types/Challenge';
import { PriceLevelCategory } from '../components/enums/Challenge';

const emptyPriceLevelBasicWithReward = {
  name: PriceLevelCategory.basicWithReward,
  category: PriceLevelCategory.basicWithReward,
  price: 0,
  takes_effect_on: '',
} as PriceLevel;

const emptyPriceLevelCompanyWithReward = {
  name: PriceLevelCategory.companyWithReward,
  category: PriceLevelCategory.companyWithReward,
  price: 0,
  takes_effect_on: '',
} as PriceLevel;

const emptyPriceLevelSchoolWithReward = {
  name: PriceLevelCategory.schoolWithReward,
  category: PriceLevelCategory.schoolWithReward,
  price: 0,
  takes_effect_on: '',
} as PriceLevel;

/**
 * Get current price levels for each with-reward category
 * Returns the most recent price levels for basic-with-reward, company-with-reward and school-with-reward categories
 * based on takes_effect_on date
 * @returns {Record<PriceLevelCategory, PriceLevel>} - Current price levels
 *   by category
 */
export const getCurrentPriceLevelsUtilWithReward = (
  priceLevels: PriceLevel[],
  now?: Date,
): Record<PriceLevelCategory, PriceLevel> => {
  if (!priceLevels) {
    // standardize empty price level structure to avoid JS errors
    const priceLevelsEmpty = {} as Record<PriceLevelCategory, PriceLevel>;
    priceLevelsEmpty[PriceLevelCategory.basicWithReward] =
      emptyPriceLevelBasicWithReward;
    priceLevelsEmpty[PriceLevelCategory.companyWithReward] =
      emptyPriceLevelCompanyWithReward;
    priceLevelsEmpty[PriceLevelCategory.schoolWithReward] =
      emptyPriceLevelSchoolWithReward;
    return priceLevelsEmpty;
  }
  if (!now) now = getCurrentDateTimeAccordingTimezone();

  const category = 'category';
  const takesEffectOn = 'takes_effect_on';

  const priceLevelsBasicWithReward = priceLevels.filter(
    (priceLevel) => priceLevel[category] === PriceLevelCategory.basicWithReward,
  );
  const priceLevelsCompanyWithReward = priceLevels.filter(
    (priceLevel) =>
      priceLevel[category] === PriceLevelCategory.companyWithReward,
  );
  const priceLevelsSchoolWithReward = priceLevels.filter(
    (priceLevel) =>
      priceLevel[category] === PriceLevelCategory.schoolWithReward,
  );

  const sortByDate = (priceLevels: Array<PriceLevel>): Array<PriceLevel> => {
    return priceLevels.sort((a: PriceLevel, b: PriceLevel) => {
      if (new Date(a[takesEffectOn]) < new Date(b[takesEffectOn])) return -1;
      else if (new Date(a[takesEffectOn]) > new Date(b[takesEffectOn]))
        return 1;
      return 0;
    });
  };

  const getCurrentPriceLevel = (priceLevels: Array<PriceLevel>) => {
    const recentPriceLevel = [];
    if (priceLevels.length == 2) {
      if (
        new Date(priceLevels[0 + 1][takesEffectOn]).getTime() == now.getTime()
      )
        recentPriceLevel.push(priceLevels[1]);
      else if (
        new Date(priceLevels[0][takesEffectOn]) <= now &&
        new Date(priceLevels[0 + 1][takesEffectOn]) > now
      )
        recentPriceLevel.push(priceLevels[0]);
    } else {
      for (let index = 0; index < priceLevels.length; ++index) {
        if (
          index + 1 < priceLevels.length &&
          new Date(priceLevels[index][takesEffectOn]) <= now &&
          new Date(priceLevels[index + 1][takesEffectOn]) > now
        ) {
          recentPriceLevel.push(priceLevels[index]);
        }
        if (index === priceLevels.length - 1) {
          if (new Date(priceLevels[index][takesEffectOn]) <= now) {
            recentPriceLevel.push(priceLevels[index]);
          }
        }
      }
    }
    return recentPriceLevel.slice(-1)[0];
  };

  // build price levels object with most recent price by category
  const priceLevelComputed = {} as Record<PriceLevelCategory, PriceLevel>;
  const currentPriceLevelBasicWithRewardComputed = getCurrentPriceLevel(
    sortByDate(priceLevelsBasicWithReward),
  );
  const currentPriceLevelCompanyWithRewardComputed = getCurrentPriceLevel(
    sortByDate(priceLevelsCompanyWithReward),
  );
  const currentPriceLevelSchoolWithRewardComputed = getCurrentPriceLevel(
    sortByDate(priceLevelsSchoolWithReward),
  );
  if (currentPriceLevelBasicWithRewardComputed)
    priceLevelComputed[PriceLevelCategory.basicWithReward] =
      currentPriceLevelBasicWithRewardComputed;
  else
    priceLevelComputed[PriceLevelCategory.basicWithReward] =
      emptyPriceLevelBasicWithReward;
  if (currentPriceLevelCompanyWithRewardComputed)
    priceLevelComputed[PriceLevelCategory.companyWithReward] =
      currentPriceLevelCompanyWithRewardComputed;
  else
    priceLevelComputed[PriceLevelCategory.companyWithReward] =
      emptyPriceLevelCompanyWithReward;
  if (currentPriceLevelSchoolWithRewardComputed)
    priceLevelComputed[PriceLevelCategory.schoolWithReward] =
      currentPriceLevelSchoolWithRewardComputed;
  else
    priceLevelComputed[PriceLevelCategory.schoolWithReward] =
      emptyPriceLevelSchoolWithReward;
  return priceLevelComputed;
};

export const defaultPaymentAmountMinComputedWithReward = (
  currentPriceLevels: Record<PriceLevelCategory, PriceLevel>,
): number => {
  if (!currentPriceLevels) return 0;
  const currentPriceLevelsBasicWithReward =
    currentPriceLevels[PriceLevelCategory.basicWithReward];
  if (!currentPriceLevelsBasicWithReward) return 0;
  return currentPriceLevelsBasicWithReward.price;
};
