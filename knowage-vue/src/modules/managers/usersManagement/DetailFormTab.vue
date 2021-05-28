<template>
  <Card style="width: 100%; margin-bottom: 2em">
    <template #header>
      <Toolbar class="kn-toolbar kn-toolbar--secondary">
        <template #left>
           {{
            $t("managers.usersManagement.detail").toUpperCase() 
          }}
        </template>
      </Toolbar>
    </template>
    <template #content>
      <div class="p-grid p-offset-1" v-if="userDetailsForm.failedLoginAttempts >= 3">
        <div class="p-col-9 p-md-9">
          <InlineMessage severity="warn">{{ $t("managers.usersManagement.blockedUserInfo") }}</InlineMessage>
        </div>
        <div class="p-col-3 p-md-3">
          <Button
            @click="unlockUser"
            icon="pi pi-lock-open"
            :label='$t("managers.usersManagement.unlockUser").toUpperCase()'
          />
        </div>
      </div>

      <form ref="detail-form">
        <div class="p-field">
          <div class="p-inputgroup">
            <span class="p-float-label">
              <InputText
                id="userId"
                type="text"
                :disabled="disableUsername"
                v-model.trim="v$.userDetailsForm.userId.$model"
                @blur="v$.userDetailsForm.userId.$touch()"
                class="p-inputtext p-component kn-material-input"
              />
              <label for="userId">{{ $t("managers.usersManagement.form.userId") }} *</label>
            </span>
          </div>

          <div v-if="v$.userDetailsForm.userId.$invalid && v$.userDetailsForm.userId.$dirty" class="p-error">
            <small v-if="v$.userDetailsForm.userId.required.$invalid">{{ v$.userDetailsForm.userId.required.$message }}</small>
          </div>
        </div>

        <div class="p-field">
          <div class="p-inputgroup">
            <span class="p-float-label">
              <InputText
                id="fullName"
                type="text"
                v-model.trim="v$.userDetailsForm.fullName.$model"
                @blur="v$.userDetailsForm.fullName.$touch()"
                class="p-inputtext p-component kn-material-input"
              />
              <label for="fullName">{{ $t("managers.usersManagement.form.fullName") }} *</label>
            </span>
          </div>

          <div v-if="v$.userDetailsForm.fullName.$invalid && v$.userDetailsForm.fullName.$dirty" class="p-error">
            <small v-if="v$.userDetailsForm.fullName.required.$invalid">{{ v$.userDetailsForm.fullName.required.$message }}</small>
          </div>
        </div>

        <div class="p-field">
          <div class="p-inputgroup">
            <span class="p-float-label">
              <InputText
                id="password"
                type="password"
                v-model.trim="v$.userDetailsForm.password.$model"
                @blur="v$.userDetailsForm.password.$touch()"
                class="p-inputtext p-component kn-material-input"
              />
              <label for="password">{{ $t("managers.usersManagement.form.password") }} *</label>
            </span>
          </div>
          <div v-if="v$.userDetailsForm.password.$invalid && v$.userDetailsForm.password.$dirty" class="p-error">
            <small v-if="v$.userDetailsForm.password.required.$invalid">{{ v$.userDetailsForm.password.required.$message }}</small>
          </div>
          <div v-if="v$.userDetailsForm.password.$invalid && v$.userDetailsForm.password.$dirty" class="p-error">
            <small v-if="v$.userDetailsForm.password.minLength.$invalid">{{ v$.userDetailsForm.password.minLength.$message }}</small>
          </div>
        </div>

        <div class="p-field">
          <div class="p-inputgroup">
            <span class="p-float-label">
              <InputText
                id="passwordConfirm"
                type="password"
                v-model.trim="v$.userDetailsForm.passwordConfirm.$model"
                class="p-inputtext p-component kn-material-input"
              />
              <label for="passwordConfirm">{{ $t("managers.usersManagement.form.passwordConfirm") }} *</label>
            </span>
          </div>

          <div v-if="v$.userDetailsForm.passwordConfirm.$invalid && v$.userDetailsForm.passwordConfirm.$dirty" class="p-error">
            <small v-if="v$.userDetailsForm.passwordConfirm.required.$invalid">{{ v$.userDetailsForm.passwordConfirm.required.$message }}</small>
          </div>

          <div v-if="v$.userDetailsForm.passwordConfirm.$invalid && v$.userDetailsForm.passwordConfirm.$dirty" class="p-error">
            <small v-if="v$.userDetailsForm.passwordConfirm.sameAsPassword.$invalid">{{ v$.userDetailsForm.passwordConfirm.sameAsPassword.$message }}</small>
          </div>
        </div>
      </form>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  required,
  requiredIf,
  sameAs,
  minLength,
  helpers,
} from "@vuelidate/validators";
import useValidate from "@vuelidate/core";
import Card from "primevue/card";
import InlineMessage from "primevue/inlinemessage";

import usersManagementDescriptor from "./UsersManagementDescriptor.json";

export default defineComponent({
  name: "roles-tab",
  components: {
    InlineMessage,
    Card,
  },
  emits:['unlock'],
  props: {
    formValues: Object,
    disabledUID: Boolean,
  },
  watch: {
    formValues: {
      handler: function (values) {
        this.userDetailsForm = values;
      },
    },
    disabledUID: {
      handler: function (value) {
        this.disableUsername = value;
      },
    },
  },
  data() {
    return {
      v$: useValidate() as any,
      userDetailsForm: {} as any,
      formInsert: true,
      attributesForm: {},
      tempAttributes: {},
      defaultRole: null,
      usersManagementDescriptor: usersManagementDescriptor,
      hiddenForm: true,
      disableUsername: true,
      loading: false,
    };
  },
  methods: {
    unlockUser() {
      this.$emit("unlock");
    },
  },
  validations() {
    return {
      userDetailsForm: {
        userId: {
          required: helpers.withMessage(
            this.$t("common.validation.required"),
            required
          ),
        },
        fullName: {
          required: helpers.withMessage(
            this.$t("common.validation.required"),
            required
          ),
        },
        password: {
          required: requiredIf(() => {
            return this.formInsert === true;
          }),
          minLength: helpers.withMessage(
            this.$t("common.validation.minimumCharacters", {
              length: 6,
            }),
            minLength(6)
          ),
        },
        passwordConfirm: {
          required: requiredIf(() => {
            return this.formInsert === true;
          }),
          sameAsPassword: sameAs(this.userDetailsForm.password),
        },
      },
    };
  },
});
</script>
