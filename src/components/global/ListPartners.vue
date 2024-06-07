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

export default defineComponent({
  name: 'ListPartners',
  setup() {
    const partners = {
      local: [
        {
          title: 'Svorada',
          image: 'https://picsum.photos/id/70/200/100',
        },
        {
          title: 'Atlas copco',
          image: 'https://picsum.photos/id/70/200/100',
        },
      ],

      general: [
        {
          title: 'GLS',
          image: 'https://picsum.photos/id/70/200/100',
        },
        {
          title: 'KB',
          image: 'https://picsum.photos/id/70/200/100',
        },
        {
          title: 'Bikero',
          image: 'https://picsum.photos/id/70/200/100',
        },
      ],

      national: [
        {
          title: 'Kudrna',
          image: 'https://picsum.photos/id/70/200/100',
        },
        {
          title: 'Ortlieb',
          image: 'https://picsum.photos/id/70/200/100',
        },
        {
          title: 'NextBike',
          image: 'https://picsum.photos/id/70/200/100',
        },
        {
          title: 'MerchYou',
          image: 'https://picsum.photos/id/70/200/100',
        },
      ],

      media: [
        {
          title: 'Česká televize',
          image: 'https://picsum.photos/id/70/200/100',
        },
      ],

      organizers: [
        {
          title: 'AutoMat',
          image: 'https://picsum.photos/id/70/200/100',
        },
      ],
    };

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
          <div class="flex items-center justify-center">
            <q-img :src="partner.image" :alt="partner.title" />
          </div>
        </div>
      </div>
      <!-- General partners -->
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
          <div class="flex items-center justify-center">
            <q-img :src="partner.image" :alt="partner.title" />
          </div>
        </div>
      </div>
      <!-- National partners -->
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
          <div class="flex items-center justify-center">
            <q-img :src="partner.image" :alt="partner.title" />
          </div>
        </div>
      </div>
      <!-- Media partners -->
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
          <div class="flex items-center justify-center">
            <q-img :src="partner.image" :alt="partner.title" />
          </div>
        </div>
      </div>
      <!-- Organizers -->
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
          <div class="flex items-center justify-center">
            <q-img :src="partner.image" :alt="partner.title" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
