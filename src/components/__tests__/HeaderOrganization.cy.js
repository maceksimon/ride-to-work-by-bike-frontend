import { colors } from 'quasar';
import HeaderOrganization from 'components/coordinator/HeaderOrganization.vue';
import { i18n } from '../../boot/i18n';

const { getPaletteColor } = colors;
const secondary = getPaletteColor('secondary');

describe('<HeaderOrganization>', () => {
  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext([], 'index.component', i18n);
  });

  context('desktop', () => {
    beforeEach(() => {
      cy.fixture('headerOrganization').then((data) => {
        cy.wrap(data.default).as('organization');
        cy.mount(HeaderOrganization, {
          props: {
            organization: data.default,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();
    imageTests();

    it('renders organization data in a row', () => {
      cy.testElementsSideBySide(
        'header-organization-branch-count',
        'header-organization-member-count',
      );
    });
  });

  context('mobile', () => {
    beforeEach(() => {
      cy.fixture('headerOrganization').then((data) => {
        cy.wrap(data.default).as('organization');
        cy.mount(HeaderOrganization, {
          props: {
            organization: data.default,
          },
        });
        cy.viewport('iphone-6');
      });
    });

    coreTests();
    imageTests();
  });

  context('no image', () => {
    beforeEach(() => {
      cy.fixture('headerOrganization').then((data) => {
        cy.wrap(data.noImage).as('organization');
        cy.mount(HeaderOrganization, {
          props: {
            organization: data.noImage,
          },
        });
        cy.viewport('macbook-16');
      });
    });

    coreTests();

    it('renders fallback icon', () => {
      cy.dataCy('header-organization-image-icon').should('be.visible');
      cy.dataCy('header-organization-image-icon').should(
        'have.color',
        secondary,
      );
    });
  });
});

function coreTests() {
  it('renders component', () => {
    cy.dataCy('header-organization').should('be.visible');
  });

  it('renders title', () => {
    cy.get('@organization').then((organization) => {
      cy.dataCy('header-organization-title')
        .should('be.visible')
        .and('contain', organization.title);
    });
  });

  it('renders branch count', () => {
    cy.get('@organization').then((organization) => {
      cy.dataCy('header-organization-branch-count')
        .should('be.visible')
        .and('contain', organization.subsidiaries.length)
        .and(
          'contain',
          i18n.global.t(
            'coordinator.labelBranches',
            organization.subsidiaries.length,
          ),
        );
    });
  });

  it('renders member count', () => {
    cy.get('@organization').then((organization) => {
      cy.dataCy('header-organization-member-count')
        .should('be.visible')
        .and('contain', organization.members.length)
        .and(
          'contain',
          i18n.global.t(
            'coordinator.labelMembers',
            organization.members.length,
          ),
        );
    });
  });

  it('renders export button', () => {
    cy.dataCy('header-organization-button-export')
      .should('be.visible')
      .and('contain', i18n.global.t('coordinator.buttonExportMembers'));
    cy.dataCy('header-organization-button-export')
      .find('i')
      .should('have.class', 'mdi-download');
  });
}

function imageTests() {
  it('renders image', () => {
    cy.get('@organization').then((organization) => {
      cy.dataCy('header-organization-image').should('be.visible');
      cy.testImageSrcAlt(
        'header-organization-image',
        organization.image.src,
        organization.image.alt,
      );
    });
  });
}
