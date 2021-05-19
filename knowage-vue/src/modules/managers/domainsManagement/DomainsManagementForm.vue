<template>
  <Dialog
    :visible="true"
    :modal="true"
    class="p-fluid kn-dialog--toolbar--primary"
    :header="formHeader"
    :closable="false"
    :style="domainsManagementDescriptor.form.style"
  >
    <form class="p-fluid p-m-5" ref="domain-form">
      <div class="p-field">
        <span class="p-float-label">
          <InputText
            id="valueCd"
            class="kn-material-input"
            type="text"
            v-model.trim="v$.domain.valueCd.$model"
            :class="{
              'p-invalid':
                v$.domain.valueCd.$invalid && v$.domain.valueCd.$dirty
            }"
            maxLength="100"
            @blur="v$.domain.valueCd.$touch()"
          />
          <label for="valueCd" class="kn-material-input-label">
            {{ $t('managers.domainsManagement.valueCode') }} *</label
          >
        </span>

        <div
          v-if="v$.domain.valueCd.$invalid && v$.domain.valueCd.$dirty"
          class="p-error"
        >
          <small v-if="v$.domain.valueCd.required.$invalid">{{
            v$.domain.valueCd.required.$message
          }}</small>
          <small v-if="v$.domain.valueCd.maxLength.$invalid">{{
            v$.domain.valueCd.maxLength.$message
          }}</small>
          <small v-if="v$.domain.valueCd.regex.$invalid">
            {{ $t('common.validation.extendedAlphanumeric') }}
          </small>
        </div>
      </div>

      <div class="p-field">
        <span class="p-float-label">
          <InputText
            id="valueName"
            class="kn-material-input"
            type="text"
            v-model.trim="v$.domain.valueName.$model"
            :class="{
              'p-invalid':
                v$.domain.valueName.$invalid && v$.domain.valueName.$dirty
            }"
            maxLength="40"
            @blur="v$.domain.valueName.$touch()"
          />
          <label for="valueName" class="kn-material-input-label"
            >{{ $t('managers.domainsManagement.valueName') }} *
          </label>
        </span>

        <div
          v-if="v$.domain.valueName.$invalid && v$.domain.valueName.$dirty"
          class="p-error"
        >
          <small v-if="v$.domain.valueName.required.$invalid">{{
            v$.domain.valueName.required.$message
          }}</small>
          <small v-if="v$.domain.valueName.maxLength.$invalid">{{
            v$.domain.valueName.maxLength.$message
          }}</small>
          <small v-if="v$.domain.valueName.regex.$invalid">
            {{ $t('common.validation.extendedAlphanumeric') }}
          </small>
        </div>
      </div>

      <div class="p-field">
        <span class="p-float-label">
          <InputText
            id="domainCode"
            class="kn-material-input"
            type="text"
            v-model.trim="v$.domain.domainCode.$model"
            :class="{
              'p-invalid':
                v$.domain.domainCode.$invalid && v$.domain.domainCode.$dirty
            }"
            maxLength="20"
            @blur="v$.domain.domainCode.$touch()"
          />
          <label for="domainCode" class="kn-material-input-label"
            >{{ $t('managers.domainsManagement.domainCode') }} *
          </label>
        </span>

        <div
          v-if="v$.domain.domainCode.$invalid && v$.domain.domainCode.$dirty"
          class="p-error"
        >
          <small v-if="v$.domain.domainCode.required.$invalid">{{
            v$.domain.domainCode.required.$message
          }}</small>
          <small v-if="v$.domain.domainCode.maxLength.$invalid">{{
            v$.domain.domainCode.maxLength.$message
          }}</small>
          <small v-if="v$.domain.domainCode.regex.$invalid">
            {{ v$.domain.domainCode.regex.$message }}
          </small>
        </div>
      </div>

      <div class="p-field">
        <span class="p-float-label">
          <InputText
            id="domainName"
            class="kn-material-input"
            type="text"
            v-model.trim="v$.domain.domainName.$model"
            :class="{
              'p-invalid':
                v$.domain.domainName.$invalid && v$.domain.domainName.$dirty
            }"
            maxLength="40"
            @blur="v$.domain.domainName.$touch()"
          />
          <label for="domainName" class="kn-material-input-label">
            {{ $t('managers.domainsManagement.domainName') }}
            *
          </label>
        </span>

        <div
          v-if="v$.domain.domainName.$invalid && v$.domain.domainName.$dirty"
          class="p-error"
        >
          <small v-if="v$.domain.domainName.required.$invalid">{{
            v$.domain.domainName.required.$message
          }}</small>
          <small v-if="v$.domain.domainName.maxLength.$invalid">{{
            v$.domain.domainName.maxLength.$message
          }}</small>
          <small v-if="v$.domain.domainName.regex.$invalid">
            {{ $t('common.validation.extendedAlphanumeric') }}
          </small>
        </div>
      </div>

      <div class="p-field">
        <span class="p-float-label">
          <InputText
            id="valueDescription"
            class="kn-material-input"
            type="text"
            v-model.trim="v$.domain.valueDescription.$model"
            :class="{
              'p-invalid':
                v$.domain.valueDescription.$invalid &&
                v$.domain.valueDescription.$dirty
            }"
            maxLength="160"
            @blur="v$.domain.valueDescription.$touch()"
          />
          <label for="valueDescription" class="kn-material-input-label"
            >{{ $t('managers.domainsManagement.valueDescription') }} *
          </label>
        </span>

        <div
          v-if="
            v$.domain.valueDescription.$invalid &&
              v$.domain.valueDescription.$dirty
          "
          class="p-error"
        >
          <small v-if="v$.domain.valueDescription.required.$invalid">{{
            v$.domain.valueDescription.required.$message
          }}</small>
          <small v-if="v$.domain.valueDescription.maxLength.$invalid">{{
            v$.domain.valueDescription.maxLength.$message
          }}</small>
          <small v-if="v$.domain.valueDescription.regex.$invalid">
            {{ $t('common.validation.extendedAlphanumeric') }}
          </small>
        </div>
      </div>
    </form>

    <template #footer>
      <Button
        class="kn-button kn-button--secondary"
        :label="$t('common.close')"
        @click="closeTemplate"
      ></Button>
      <Button
        class="kn-button kn-button--primary"
        :label="$t('common.save')"
        :disabled="buttonDisabled"
        @click="handleSubmit"
      ></Button>
    </template>
  </Dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { required, maxLength, helpers } from '@vuelidate/validators';
import { iDomain } from './DomainsManagement';
import { extendedAlphanumeric } from '@/helpers/commons/regexHelper';
import axios from 'axios';
import Dialog from 'primevue/dialog';
import domainsManagementDescriptor from './DomainsManagementDescriptor.json';
import useValidate from '@vuelidate/core';

const regex = (value: any) => {
  return extendedAlphanumeric.test(value);
};

export default defineComponent({
  name: 'domain-management-form',
  components: { Dialog },
  props: {
    model: {
      type: Object,
      requried: false
    }
  },
  emits: ['close', 'created'],
  data() {
    return {
      domainsManagementDescriptor: domainsManagementDescriptor,
      domain: {} as iDomain,
      dirty: false,
      v$: useValidate() as any,
      operation: 'insert'
    };
  },
  validations() {
    return {
      domain: {
        valueCd: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          maxLength: helpers.withMessage(
            this.$t('common.validation.maximumCharacters', {
              length: 100
            }),
            maxLength(100)
          ),
          regex
        },
        valueName: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          maxLength: helpers.withMessage(
            this.$t('common.validation.maximumCharacters', {
              length: 40
            }),
            maxLength(40)
          ),
          regex: helpers.withMessage(
            this.$t('common.validation.extendedAlphanumeric'),
            regex
          )
        },
        domainCode: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          maxLength: helpers.withMessage(
            this.$t('common.validation.maximumCharacters', {
              length: 20
            }),
            maxLength(20)
          ),
          regex
        },
        domainName: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          maxLength: helpers.withMessage(
            this.$t('common.validation.maximumCharacters', {
              length: 40
            }),
            maxLength(40)
          ),
          regex
        },
        valueDescription: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          maxLength: helpers.withMessage(
            this.$t('common.validation.maximumCharacters', {
              length: 160
            }),
            maxLength(160)
          ),
          regex
        }
      }
    };
  },
  computed: {
    formHeader(): any {
      return this.domain.valueId
        ? this.$t('common.edit')
        : this.$t('common.new');
    },
    buttonDisabled(): any {
      return this.v$.$invalid;
    }
  },
  mounted() {
    if (this.model) {
      this.domain = this.model as iDomain;
    }
  },
  methods: {
    async handleSubmit() {
      if (this.v$.$invalid) {
        return;
      }

      let url = process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/domains';
      if (this.domain.valueId) {
        this.operation = 'update';
        url += '/' + this.domain.valueId;
      }

      await this.sendRequest(url).then(() => {
        this.$store.commit('setInfo', {
          title: this.$t(
            this.domainsManagementDescriptor.operation[this.operation]
              .toastTitle
          ),
          msg: this.$t(this.domainsManagementDescriptor.operation.success)
        });
        this.$emit('created');
      });
    },
    sendRequest(url: string) {
      if (this.operation === 'insert') {
        return axios.post(url, this.domain);
      } else {
        return axios.put(url, this.domain);
      }
    },
    closeTemplate() {
      this.$emit('close');
    }
  }
});
</script>
