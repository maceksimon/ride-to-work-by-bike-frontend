<script lang="ts">
/**
 * LoginPage Component
 *
 * The `LoginPage` renders the page with login form and password reset form.
 *
 * @description
 * This component is used to allow user to login into their account. Or
 * reset their password. It allows login via Google and Facebook accounts.
 * It contains links to App stores.
 *
 * @components
 * - `FormLogin`: Component to render login form.
 * - `LoginRegisterHeader`: Component to render page header.
 *
 * @layout
 * - `LoginRegisterLayout`: Displayed in the `LoginRegisterLayout` template.
 *
 * @see [Figma Design](https://www.figma.com/file/L8dVREySVXxh3X12TcFDdR/Do-pr%C3%A1ce-na-kole?type=design&node-id=6269%3A24768&mode=dev)
 */

// libraries
import { defineComponent } from 'vue';

// components
import FormLogin from 'components/login/FormLogin.vue';
import LoginRegisterHeader from 'components/global/LoginRegisterHeader.vue';

export default defineComponent({
  name: 'LoginPage',
  components: {
    FormLogin,
    LoginRegisterHeader,
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <q-page padding>
    <div class="q-px-lg">
      <!-- Page header -->
      <login-register-header data-cy="login-register-header" />

      <div class="row">
        <div class="col-12 col-md-4">
          <form-login useFormFieldValidationErrorCssClass />
        </div>
      </div>
    </div>
  </q-page>
</template>
