// composables
import { i18n } from '../boot/i18n';

// enums
import { rideToWorkByBikeConfig } from 'src/boot/global_vars';
import { UsefulLinkId } from '../components/types/Link';

// fixtures
import usefulLinksFixture from '../../test/cypress/fixtures/usefulLinks.json';

// types
import type { UsefulLink } from '../components/types/Link';

export const useUsefulLinks = () => {
  const usefulLinks: UsefulLink[] = usefulLinksFixture.map((item) => {
    let url;
    switch (item.id) {
      case UsefulLinkId.autoMat:
        url = rideToWorkByBikeConfig.urlAutoMat;
        break;
      case UsefulLinkId.support:
        url = rideToWorkByBikeConfig.urlAutoMat;
        break;
      case UsefulLinkId.projectCode:
        url = rideToWorkByBikeConfig.urlProjectSourceCode;
        break;
      case UsefulLinkId.mobileApp:
        url = rideToWorkByBikeConfig.urlAppStore;
        break;
      default:
        url = '';
    }

    return {
      ...item,
      url,
      title: i18n.global.t(item.title),
    } as UsefulLink;
  });

  return {
    usefulLinks,
  };
};
