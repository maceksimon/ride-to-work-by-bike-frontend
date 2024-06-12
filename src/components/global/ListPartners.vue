<script lang="ts">
/**
 * ListPartners Component
 *
 * @description * Use this component to display a list of partners.
 *
 * @example
 * <list-partners />
 *
 * @see [Figma Design](https://www.figma.com/design/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?node-id=4858-104166&t=WTpd0VJBlc62yzhj-1)
 */

// libraries
import { defineComponent } from 'vue';

// fixtures
import listPartners from '../../../test/cypress/fixtures/listPartners.json';

export default defineComponent({
  name: 'ListPartners',
  setup() {
    const partners = listPartners;

    return {
      partners,
    };
  },
});
</script>

<template>
  <div data-cy="list-partners">
    <h2 class="text-h6 q-my-none text-black" data-cy="list-partners-title">
      {{ $t('listPartners.titlePartners') }}
    </h2>
    <!-- Local partners -->
    <div class="q-mt-lg">
      <template v-if="partners.local">
        <h3 class="text-body1 text-weight-bold q-my-lg">
          {{ $t('listPartners.titleLocal') }}
        </h3>
        <div class="row q-col-gutter-lg" data-cy="partners-local">
          <div
            v-for="partner in partners.local"
            :key="partner.title"
            class="col-3 col-sm-2 col-md-1"
            data-cy="partners-local-item"
          >
            <q-item
              dense
              :href="partner.url"
              target="_blank"
              class="flex items-center justify-center q-py-none q-px-none"
            >
              <q-img :src="partner.image" :alt="partner.title" />
            </q-item>
          </div>
        </div>
      </template>
      <!-- General partners -->
      <template v-if="partners.general">
        <h3 class="text-body1 text-weight-bold q-my-lg">
          {{ $t('listPartners.titleGeneral') }}
        </h3>
        <div class="row q-col-gutter-lg" data-cy="partners-general">
          <div
            v-for="partner in partners.general"
            :key="partner.title"
            class="col-6 col-sm-3 col-md-2"
            data-cy="partners-general-item"
          >
            <q-item
              dense
              :href="partner.url"
              target="_blank"
              class="flex items-center justify-center q-py-none q-px-none"
            >
              <q-img :src="partner.image" :alt="partner.title" />
            </q-item>
          </div>
        </div>
      </template>
      <!-- National partners -->
      <template v-if="partners.national">
        <h3 class="text-body1 text-weight-bold q-my-lg">
          {{ $t('listPartners.titleNational') }}
        </h3>
        <div class="row q-col-gutter-lg" data-cy="partners-national">
          <div
            v-for="partner in partners.national"
            :key="partner.title"
            class="col-6 col-sm-3 col-md-2"
            data-cy="partners-national-item"
          >
            <q-item
              dense
              :href="partner.url"
              target="_blank"
              class="flex items-center justify-center q-py-none q-px-none"
            >
              <q-img :src="partner.image" :alt="partner.title" />
            </q-item>
          </div>
        </div>
      </template>
      <!-- Media partners -->
      <template v-if="partners.media">
        <h3 class="text-body1 text-weight-bold q-my-lg">
          {{ $t('listPartners.titleMedia') }}
        </h3>
        <div class="row q-col-gutter-lg" data-cy="partners-media">
          <div
            v-for="partner in partners.media"
            :key="partner.title"
            class="col-3 col-sm-2 col-md-1"
            data-cy="partners-media-item"
          >
            <q-item
              dense
              :href="partner.url"
              target="_blank"
              class="flex items-center justify-center q-py-none q-px-none"
            >
              <q-img :src="partner.image" :alt="partner.title" />
            </q-item>
          </div>
        </div>
      </template>
      <!-- Organizers -->
      <template v-if="partners.organizers">
        <h3 class="text-body1 text-weight-bold q-my-lg">
          {{ $t('listPartners.titleOrganizers') }}
        </h3>
        <div class="row q-col-gutter-lg" data-cy="partners-organizers">
          <div
            v-for="partner in partners.organizers"
            :key="partner.title"
            class="col-6 col-sm-3 col-md-2"
            data-cy="partners-organizers-item"
          >
            <q-item
              dense
              :href="partner.url"
              target="_blank"
              class="flex items-center justify-center q-py-none q-px-none"
            >
              <q-img :src="partner.image" :alt="partner.title" />
            </q-item>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
