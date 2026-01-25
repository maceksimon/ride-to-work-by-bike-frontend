import { createPinia, setActivePinia } from 'pinia';
import { ref } from 'vue';
import { colors } from 'quasar';
import FormUpdateTeam from 'components/form/FormUpdateTeam.vue';
import { i18n } from '../../boot/i18n';
import { rideToWorkByBikeConfig } from '../../boot/global_vars';
import { useRegisterChallengeStore } from '../../stores/registerChallenge';
import { useLoginStore } from '../../stores/login';
import { vModelAdapter } from '../../../test/cypress/utils';

// colors
const { getPaletteColor } = colors;
const grey10 = getPaletteColor('grey-10');

describe('<FormUpdateTeam>', () => {
  const model = ref(null);
  const setModelValue = (value) => {
    model.value = value;
  };

  it('has translation for all strings', () => {
    cy.testLanguageStringsInContext(
      ['labelTeam', 'messageFieldRequired'],
      'form',
      i18n,
    );
    cy.testLanguageStringsInContext(['linkCreateNewTeam'], 'form.team', i18n);
    cy.testLanguageStringsInContext(
      ['discardChanges', 'save'],
      'navigation',
      i18n,
    );
  });

  context('desktop', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      const updateModelValueSpy = cy.spy().as('updateModelValueSpy');
      const closeSpy = cy.spy().as('closeSpy');
      cy.wrap(setModelValue(null));
      cy.mount(FormUpdateTeam, {
        props: {
          ...vModelAdapter(model),
          'onUpdate:modelValue': updateModelValueSpy,
          onClose: closeSpy,
        },
      }).then((wrapper) => {
        cy.wrap(wrapper).as('vue');
      });
      cy.viewport('macbook-16');
    });

    coreTests();
  });

  context('mobile', () => {
    beforeEach(() => {
      setActivePinia(createPinia());
      const updateModelValueSpy = cy.spy().as('updateModelValueSpy');
      const closeSpy = cy.spy().as('closeSpy');
      cy.wrap(setModelValue(null));
      cy.mount(FormUpdateTeam, {
        props: {
          ...vModelAdapter(model),
          'onUpdate:modelValue': updateModelValueSpy,
          onClose: closeSpy,
        },
      }).then((wrapper) => {
        cy.wrap(wrapper).as('vue');
      });
      cy.viewport('iphone-6');
    });

    coreTests();
  });
});

function coreTests() {
  it('renders component', () => {
    // component
    cy.dataCy('form-update-team').should('be.visible');
    // label
    cy.dataCy('form-label')
      .should('be.visible')
      .and('have.css', 'font-size', '12px')
      .and('have.css', 'font-weight', '700')
      .and('have.color', grey10)
      .and('contain', i18n.global.t('form.labelTeam'));
    // select
    cy.dataCy('form-select').should('be.visible');
    // create team button
    cy.dataCy('form-link-create-mode')
      .should('be.visible')
      .and('contain', i18n.global.t('form.team.linkCreateNewTeam'));
    // cancel
    cy.dataCy('form-button-cancel')
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.discardChanges'));
    // save
    cy.dataCy('form-button-save')
      .should('be.visible')
      .and('contain', i18n.global.t('navigation.save'));
  });

  it('renders buttons side by side', () => {
    cy.testElementsSideBySide('form-button-cancel', 'form-button-save');
  });

  it('allows to switch to create mode', () => {
    cy.dataCy('form-link-create-mode').should('be.visible').click();
    cy.dataCy('form-add-team').should('be.visible');
    cy.dataCy('form-link-select-mode')
      .should('be.visible')
      .and('contain', i18n.global.t('form.team.linkSelectExistingTeam'));
  });

  it('calls onCreateTeam when submitting create form', () => {
    cy.fixture('apiPostTeamResponse').then((teamResponse) => {
      cy.setupLoginAccessToken(useLoginStore);
      cy.setupRegisterChallengeSubsidiaryId(useRegisterChallengeStore, 1);
      cy.interceptTeamPostApi(rideToWorkByBikeConfig, i18n, 1);

      // use create mode
      cy.dataCy('form-link-create-mode').should('be.visible').click();
      cy.dataCy('form-add-team').should('be.visible');
      // fill in team name
      cy.dataCy('form-add-team-name').find('input').type(teamResponse.name);
      // submit
      cy.dataCy('form-button-save').click();
      cy.waitForTeamPostApi({
        name: teamResponse.name,
      });
      cy.get('@updateModelValueSpy').should('have.been.calledOnce');
      cy.get('@updateModelValueSpy').should(
        'have.been.calledWith',
        teamResponse.id,
      );
      cy.get('@closeSpy').should('have.been.calledOnce');
    });
  });
}
