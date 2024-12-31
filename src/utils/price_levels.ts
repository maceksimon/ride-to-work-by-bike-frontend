import type { PriceLevel } from '../components/types/Challenge';
import type { PriceLevelCategory } from '../components/enums/Challenge';

/**
 * Get current price levels for each category
 * Returns the most recent price levels for basic and company categories
 * based on takes_effect_on date
 * @returns {Record<PriceLevelCategory, PriceLevel>} - Current price levels
 *   by category
 */
export function getCurrentPriceLevelsUtil(
  priceLevels: PriceLevel[],
): Record<PriceLevelCategory, PriceLevel> {
  return priceLevels.reduce(
    (mostRecentPriceLevelsByCategory, priceLevel) => {
      const currentDate = new Date(priceLevel.takes_effect_on);
      const existingLevel =
        mostRecentPriceLevelsByCategory[priceLevel.category];

      if (
        !existingLevel ||
        currentDate > new Date(existingLevel.takes_effect_on)
      ) {
        mostRecentPriceLevelsByCategory[priceLevel.category] = priceLevel;
      }

      return mostRecentPriceLevelsByCategory;
    },
    {} as Record<PriceLevelCategory, PriceLevel>,
  );
}
