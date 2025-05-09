<script lang="ts">
/**
 * HeaderOrganization Component
 *
 * @description * Use this component to display information about an
 * organization.
 * Note: This component is commonly used on `CompanyCoordinatorPage`.
 *
 * @props
 * - `organization` (Organization, required): The object representing an
 * organization. It should be of type `Organization`.
 *
 * @emits
 * - `export`: Emitted when the user clicks on the export button.
 *   It should have no payload and be handled in the parent component.
 *
 * @example
 * <header-organization />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104524&t=imgBE8Jw7Jgty90T-1)
 */

// libraries
import { computed, defineComponent } from 'vue';

// types
import type { Organization } from '../types/Organization';

export default defineComponent({
  name: 'HeaderOrganization',
  props: {
    organization: {
      type: Object as () => Organization,
      required: true,
    },
  },
  emits: ['export'],
  setup(props) {
    const subsidiariesCount = computed((): number => {
      return props.organization?.subsidiaries?.length
        ? props.organization.subsidiaries.length
        : 0;
    });

    const countMembers = computed((): number => {
      return props.organization?.members?.length
        ? props.organization.members.length
        : 0;
    });

    return {
      subsidiariesCount,
      countMembers,
    };
  },
});
</script>

<template>
  <div class="row q-col-gutter-y-md items-center" data-cy="header-organization">
    <!-- Organization data -->
    <div class="col-12 col-sm row q-col-gutter-x-md">
      <div class="col-auto">
        <q-avatar data-cy="header-organization-image" size="96px">
          <!-- Image -->
          <q-img
            v-if="organization.image"
            :src="organization.image.src"
            ratio="1"
            width="96"
            height="96"
            :alt="organization.image.alt"
          />
          <!-- Fallback icon -->
          <q-icon v-else name="mdi-office-building" size="96px" />
        </q-avatar>
      </div>
      <div class="col">
        <div class="q-pt-sm">
          <!-- Title -->
          <h3
            class="text-h5 text-weight-bold q-my-none"
            data-cy="header-organization-title"
          >
            {{ organization.title }}
          </h3>
          <!-- Metadata -->
          <div class="row text-subtitle2">
            <!-- Organization ID -->
            <q-item dense class="col-auto q-pa-none">
              <q-item-section v-if="organization.identificationNumber">
                <!-- Label -->
                {{ $t('coordinator.labelOrganizationId') }}:
                {{ organization.identificationNumber }}
              </q-item-section>
            </q-item>
            <!-- Branch -->
            <q-item dense class="col-auto q-pa-none" v-if="subsidiariesCount">
              <q-item-section avatar>
                <!-- Icon -->
                <q-icon name="mdi-office-building" color="grey-6" size="18px" />
              </q-item-section>
              <q-item-section data-cy="header-organization-branch-count">
                <!-- Label -->
                {{ subsidiariesCount }}
                {{ $t('coordinator.labelBranches', subsidiariesCount) }}
              </q-item-section>
            </q-item>
            <!-- Members -->
            <q-item dense class="col-auto q-pa-none" v-if="countMembers">
              <q-item-section avatar>
                <!-- Icon -->
                <q-icon name="mdi-account" color="grey-6" size="18px" />
              </q-item-section>
              <q-item-section data-cy="header-organization-member-count">
                <!-- Label -->
                {{ countMembers }}
                {{ $t('coordinator.labelMembers', countMembers) }}
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </div>
    <!-- Button: Export -->
    <div class="col-12 col-sm-auto">
      <q-btn
        unelevated
        rounded
        outline
        color="primary"
        class="flex items-center"
        data-cy="header-organization-button-export"
        @click.prevent="$emit('export')"
      >
        <q-icon name="mdi-download" size="18px" class="q-mr-sm" />
        {{ $t('coordinator.buttonExportMembers') }}
      </q-btn>
    </div>
  </div>
</template>
