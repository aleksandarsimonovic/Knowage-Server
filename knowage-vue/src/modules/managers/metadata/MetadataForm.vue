<template>
  <Toolbar class="kn-toolbar kn-toolbar--primary">
    <template #right>
      <Button
        class="kn-button p-button-text"
        @click="handleSubmit"
        :disabled="buttonDisabled"
        >{{ $t('common.save') }}</Button
      >
      <Button class="kn-button p-button-text" @click="closeTemplate">{{
        $t('common.close')
      }}</Button>
    </template>
  </Toolbar>

  <form class="p-fluid p-m-5">
    <div class="p-field">
      <span class="p-float-label">
        <InputText
          id="label"
          class="kn-material-input"
          type="text"
          v-model.trim="v$.metadata.label.$model"
          :class="{
            'p-invalid': v$.metadata.label.$invalid && v$.metadata.label.$dirty
          }"
          @blur="v$.metadata.label.$touch()"
          @change="setDirty"
          data-test="label-input"
        />
        <label for="label" class="kn-material-input-label">{{
          $t('common.label')
        }}</label>
      </span>

      <div
        v-if="v$.metadata.label.$invalid && v$.metadata.label.$dirty"
        class="p-error"
      >
        <small
          class="p-error"
          v-for="(error, index) of v$.metadata.label.$errors"
          :key="index"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <div class="p-field">
      <span class="p-float-label">
        <InputText
          id="name"
          class="kn-material-input"
          type="text"
          v-model.trim="v$.metadata.name.$model"
          :class="{
            'p-invalid': v$.metadata.name.$invalid && v$.metadata.name.$dirty
          }"
          @blur="v$.metadata.name.$touch()"
          @change="setDirty"
          data-test="name-input"
        />
        <label for="name" class="kn-material-input-label">{{
          $t('common.name')
        }}</label>
      </span>
      <div
        v-if="v$.metadata.name.$invalid && v$.metadata.name.$dirty"
        class="p-error"
      >
        <small
          class="p-error"
          v-for="(error, index) of v$.metadata.name.$errors"
          :key="index"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <div class="p-field">
      <span class="p-float-label">
        <InputText
          id="description"
          class="kn-material-input"
          type="text"
          v-model.trim="v$.metadata.description.$model"
          :class="{
            'p-invalid':
              v$.metadata.description.$invalid && v$.metadata.description.$dirty
          }"
          @blur="v$.metadata.label.$touch()"
          @change="setDirty"
          data-test="description-input"
        />
        <label for="description" class="kn-material-input-label">{{
          $t('common.description')
        }}</label>
      </span>
      <div
        v-if="
          v$.metadata.description.$invalid && v$.metadata.description.$dirty
        "
        class="p-error"
      >
        <small
          class="p-error"
          v-for="(error, index) of v$.metadata.description.$errors"
          :key="index"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>

    <div class="p-field">
      <span class="p-float-label">
        <Dropdown
          id="dataType"
          class="kn-material-input"
          :class="{
            'p-invalid':
              v$.metadata.dataType.$invalid && v$.metadata.dataType.$dirty
          }"
          v-model="v$.metadata.dataType.$model"
          :options="metadataTypes"
          optionLabel="name"
          optionValue="value"
          @before-show="v$.metadata.dataType.$touch()"
          @change="setDirty"
          data-test="dataType-dropdown"
        />
        <label for="dataType" class="kn-material-input-label">{{
          $t('common.type')
        }}</label>
      </span>
      <div
        v-if="v$.metadata.dataType.$invalid && v$.metadata.dataType.$dirty"
        class="p-error"
      >
        <small
          class="p-error"
          v-for="(error, index) of v$.metadata.dataType.$errors"
          :key="index"
        >
          {{ error.$message }}
        </small>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { required, helpers } from '@vuelidate/validators';
import { extendedAlphanumeric } from '@/helpers/commons/regexHelper';
import { iMetadata } from './Metadata';
import axios from 'axios';
import Dropdown from 'primevue/dropdown';
import metadataDescriptor from './MetadataDescriptor.json';
import useValidate from '@vuelidate/core';

const regex = (value: any) => {
  return extendedAlphanumeric.test(value);
};

export default defineComponent({
  name: 'metadata-form',
  components: {
    Dropdown
  },
  props: {
    model: {
      type: Object,
      requried: false
    }
  },
  emits: ['close', 'saved', 'touched'],
  data() {
    return {
      metadataDescriptor: metadataDescriptor,
      metadata: {} as any,
      metadataTypes: metadataDescriptor.metadataTypes,
      submitted: false as Boolean,
      operation: 'insert',
      v$: useValidate() as any
    };
  },
  validations() {
    return {
      metadata: {
        label: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          regex: helpers.withMessage(
            this.$t('common.validation.extendedAlphanumeric'),
            regex
          )
        },
        name: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          regex: helpers.withMessage(
            this.$t('common.validation.extendedAlphanumeric'),
            regex
          )
        },
        description: {
          regex: helpers.withMessage(
            this.$t('common.validation.extendedAlphanumeric'),
            regex
          )
        },
        dataType: {
          required: helpers.withMessage(
            this.$t('common.validation.required'),
            required
          ),
          validType(type: string) {
            if (type && type.length > 0) {
              return type === 'LONG_TEXT' || type === 'SHORT_TEXT' || type === 'FILE';
            }
            return false;
          }
        }
      }
    };
  },
  computed: {
    buttonDisabled(): any {
      return this.v$.$invalid;
    }
  },
  watch: {
    model() {
      this.v$.$reset();
      this.metadata = { ...this.model } as iMetadata;
    }
  },
  mounted() {
    if (this.model) {
      this.metadata = { ...this.model } as iMetadata;
    }
  },
  methods: {
    async handleSubmit() {
      if (this.v$.$invalid) {
        return;
      }

      // TODO WRONG API
      if (this.metadata.objMetaId) {
        this.operation = 'update';
        this.metadata.id = this.metadata.objMetaId;
        delete this.metadata.objMetaId;
        delete this.metadata.dataTypeCode;
        delete this.metadata.creationDate;
      }

      await axios
        .post(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/objMetadata',
          this.metadata
        )
        .then(() => {
          this.$store.commit('setInfo', {
            title: this.$t(
              this.metadataDescriptor.operation[this.operation].toastTitle
            ),
            msg: this.$t(this.metadataDescriptor.operation.success)
          });
          this.$emit('saved');
        });
    },
    closeTemplate() {
      this.$emit('close');
    },
    setDirty(): void {
      this.$emit('touched');
    }
  }
});
</script>
