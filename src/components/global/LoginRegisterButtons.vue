<script lang="ts">
/**
 * LoginRegisterButtons Component
 *
 * The `LoginRegisterButtons` component is used for login or registration
 * via external providers such as Google, Facebook, etc.
 *
 * @description * Use this component to render the buttons and handle
 * authentication.
 *
 * Note: This component is commonly used in `FormLogin` and `FormRegister`.
 *
 * @props
 * - `variant` (String: 'login' | 'register', required): Determines the
 * function based on whether the component is used for login or
 * registration.
 *
 * @example
 * <login-register-buttons />
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6274%3A28817&mode=dev)
 */

import { defineComponent, inject } from 'vue';
import { VFBLoginScope as VFacebookLoginScope } from 'vue-facebook-login-component-next';

// types
import type { Logger } from '../types/Logger';

export default defineComponent({
  name: 'LoginRegisterButtons',
  components: {
    VFacebookLoginScope,
  },
  props: {
    variant: {
      type: String as () => 'login' | 'register',
      required: true,
    },
  },
  setup() {
    const facebookAppId = process.env.FACEBOOK_APP_ID;

    const logger: Logger | undefined = inject('vuejs3-logger');

    return {
      facebookAppId,
      logger,
    };
  },
});
</script>

<template>
  <div>
    <!-- Button: Login Google -->
    <q-btn
      unelevated
      rounded
      outline
      color="primary"
      class="full-width"
      data-cy="login-register-button-google"
    >
      <!-- Icon -->
      <q-icon
        name="fab fa-google"
        size="18px"
        color="primary"
        class="q-mr-sm"
        data-cy="login-register-button-google-icon"
      />
      <!-- Label -->
      <span v-if="variant === 'login'">{{
        $t('login.buttons.buttonGoogle')
      }}</span>
      <span v-else-if="variant === 'register'">{{
        $t('register.buttons.buttonGoogle')
      }}</span>
    </q-btn>
    <!-- Button: Login Facebook -->
    <v-facebook-login-scope :app-id="facebookAppId" v-slot="scope">
      <q-btn
        unelevated
        rounded
        outline
        color="white"
        class="full-width q-mt-md"
        data-cy="login-register-button-facebook"
        @click="scope.login"
      >
        <!-- Icon -->
        <q-icon
          name="facebook"
          size="24px"
          color="white"
          class="q-mr-sm"
          data-cy="login-register-button-facebook-icon"
        />
        <!-- Label -->
        <span v-if="variant === 'login'">{{
          $t('login.buttons.buttonFacebook')
        }}</span>
        <span v-else-if="variant === 'register'">{{
          $t('register.buttons.buttonFacebook')
        }}</span>
      </q-btn>
    </v-facebook-login-scope>
  </div>
</template>
