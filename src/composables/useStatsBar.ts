// composables
import { i18n } from '../boot/i18n';

// enums
import { StatisticsId } from '../components/types/Statistics';

export const useStatsBar = () => {
  /**
   * Get the icon of the statistic.
   * @param id - The id of the statistic.
   * @returns The icon of the statistic or an empty string.
   */
  const getStatIcon = (id: StatisticsId) => {
    switch (id) {
      case StatisticsId.distance:
        return 'svguse:icons/stats_bar/icons.svg#jam-arrows-h';
      case StatisticsId.routes:
        return 'svguse:icons/stats_bar/icons.svg#lucide-route';
      case StatisticsId.co2:
        return 'svguse:icons/stats_bar/icons.svg#tabler-leaf';
      default:
        return '';
    }
  };

  /**
   * Get the label of the statistic.
   * @param id - The id of the statistic.
   * @returns The label of the statistic or an empty string.
   */
  const getStatLabel = (id: StatisticsId) => {
    switch (id) {
      case StatisticsId.routes:
        return i18n.global.t('statsBar.labelSustainableRoutes');
      case StatisticsId.co2:
        return i18n.global.t('statsBar.labelSaved');
      default:
        return '';
    }
  };

  /**
   * Get the unit of the statistic.
   * @param id - The id of the statistic.
   * @returns The unit of the statistic or an empty string.
   */
  const getStatUnit = (id: StatisticsId) => {
    switch (id) {
      case StatisticsId.distance:
        return i18n.global.t('global.routeLengthUnit');
      case StatisticsId.co2:
        return i18n.global.t('global.carbonDioxideWeightUnit');
      default:
        return '';
    }
  };

  return {
    getStatIcon,
    getStatLabel,
    getStatUnit,
  };
};
