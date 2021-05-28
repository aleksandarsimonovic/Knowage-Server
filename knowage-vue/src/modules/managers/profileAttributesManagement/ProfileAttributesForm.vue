<template>
  <Toolbar class="kn-toolbar kn-toolbar--secondary">
    <template #left>
      {{ attribute.attributeName }}
    </template>
    <template #right>
      <Button
        icon="pi pi-save"
        class="kn-button p-button-text p-button-rounded"
        @click="save"
        :disabled="v$.attribute.$invalid"
      />
      <Button
        class="kn-button p-button-text p-button-rounded"
        icon="pi pi-times"
        @click="closeForm"
      />
    </template>
  </Toolbar>
  <ProgressBar
    mode="indeterminate"
    class="kn-progress-bar"
    v-if="loading"
    data-test="progress-bar"
  />
  <div class="card">
    <Card style="width: 100%; margin-bottom: 2em">
      <template #content>
        <form ref="profile-attributes-form">
          <div class="p-field">
            <div class="p-inputgroup">
              <span class="p-float-label">
                <InputText
                  id="attributeName"
                  type="text"
                  v-model.trim="v$.attribute.attributeName.$model"
                  @blur="v$.attribute.attributeName.$touch()"
                  class="p-inputtext p-component kn-material-input"
                />
                <label for="attributeName">{{ $t("managers.profileAttributesManagement.form.name") }} *</label>
              </span>
            </div>

            <div v-if="v$.attribute.attributeName.$invalid && v$.attribute.attributeName.$dirty" class="p-error">
              <small v-if="v$.attribute.attributeName.required.$invalid">{{ v$.attribute.attributeName.required.$message }}</small>
            </div>
          </div>

          <div class="p-field">
            <div class="p-inputgroup">
              <span class="p-float-label">
                <InputText
                  id="attributeDescription"
                  type="text"
                  v-model.trim="v$.attribute.attributeDescription.$model"
                  @blur="v$.attribute.attributeDescription.$touch()"
                  class="p-inputtext p-component kn-material-input"
                />
                <label for="attributeDescription">{{ $t("managers.profileAttributesManagement.form.description") }} *</label>
              </span>
            </div>

            <div v-if="v$.attribute.attributeDescription.$invalid && v$.attribute.attributeDescription.$dirty" class="p-error">
              <small v-if="v$.attribute.attributeDescription.required.$invalid">{{ v$.attribute.attributeDescription.required.$message }}</small>
            </div>
          </div>

          <div class="p-field">
            <div class="p-inputgroup">
              <span class="p-float-label">
                <Dropdown
                  id="dataType"
                  v-model="v$.attribute.value.$model"
                  :options="attributeTypeValues"
                  optionLabel="name"
                  optionValue="value"
                  class="p-dropdown p-component p-inputwrapper p-inputwrapper-filled kn-material-input"
                />
                <label for="dataType">{{ $t("managers.profileAttributesManagement.form.dataType") }} *</label>
              </span>
            </div>
          </div>

          <div class="p-inputgroup p-col-6 p-sm-12 p-md-6">
            <div class="p-field-radiobutton p-col-6 p-sm-12 p-md-6">
              <RadioButton
                id="disableLov"
                name="disableLov"
                v-model="disableLov"
                :value="false"
                @change="hideLovDropdown"
              />
              <label for="disableLov">{{ $t("managers.profileAttributesManagement.form.manualInput") }}</label>
            </div>

            <div class="p-field-radiobutton p-col-6 p-sm-12 p-md-6">
              <RadioButton
                id="lov"
                name="enableLov"
                :value="false"
                v-model="enableLov"
                @change="showLovDropdown"
              />
              <label for="enableLov">{{ $t("managers.profileAttributesManagement.form.lov") }}</label>
            </div>
          </div>

          <div class="p-field" :hidden="LovSelectHidden">
            <div class="p-inputgroup">
              <span class="p-float-label">
                <Dropdown
                  v-model="v$.attribute.lovId.$model"
                  :options="lovs"
                  optionLabel="name"
                  optionValue="id"
                  class="p-dropdown p-component p-inputwrapper p-inputwrapper-filled kn-material-input"
                />

                <label for="attributeDescription">{{ $t("managers.profileAttributesManagement.form.lov") }} *</label>
              </span>
            </div>
          </div>

          <div class="p-inputgroup p-col-6 p-sm-12 p-md-6">
            <div class="p-field-radiobutton p-col-6 p-sm-12 p-md-6">
              <InputSwitch v-model="v$.attribute.multivalue.$model" />
              <i class="pi pi-bars"></i>
              <label for="multiValue">{{ $t("managers.profileAttributesManagement.form.multiValue") }}</label>
            </div>

            <div class="p-field-radiobutton p-col-6 p-sm-12 p-md-6">
              <InputSwitch v-model="v$.attribute.allowUser.$model" />
              <i class="pi pi-eye"></i>
              <label for="multiValue">{{ $t("managers.profileAttributesManagement.form.allowUser") }}</label>
            </div>
          </div>
        </form>
      </template>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios, { AxiosResponse } from "axios";
import Dropdown from "primevue/dropdown";
import InputSwitch from "primevue/inputswitch";
import RadioButton from "primevue/radiobutton";
import ProfileAttributesManagementDescriptor from "./ProfileAttributesManagementDescriptor.json";
import { iAttribute, iLov } from "./ProfileAttributesManagement";
import { required, helpers } from "@vuelidate/validators";
import useValidate from "@vuelidate/core";

export default defineComponent({
  name: "profile-attributes-form",
  components: {
    Dropdown,
    InputSwitch,
    RadioButton,
  },
  props: {
    selectedAttribute: {
      type: Object,
      requried: true,
    },
  },
  watch: {
    selectedAttribute: {
      handler: function (attribute) {

       if(attribute.attributeId === null){ 
           this.resetForm();
           return
       }

        if (typeof this.tempAttribute.value === "object" && this.tempAttribute.value !== null) {
          this.tempAttribute.value = this.tempAttribute.value["name"];
        }

        this.isDirty = this.isFormDirty();

        if (this.isDirty) {
          this.$confirm.require({
            message: this.$t("managers.usersManagement.unsavedChangesMessage"),
            header: this.$t("managers.usersManagement.unsavedChangesHeader"),
            icon: "pi pi-exclamation-triangle",
            accept: () => {
              this.populateForm(attribute);
            },
            reject: () => {
              this.isDirty = false;
            },
          });
        } else {
          this.populateForm(attribute);
        }
      },
    },
  },
  emits: ["refreshRecordSet", "closesForm"],
  data() {
    return {
      v$: useValidate() as any,
      apiUrl: process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/",
      attribute: {} as iAttribute,
      tempAttribute: {} as iAttribute,
      lovs: {} as iLov,
      profileAttributesManagementDescriptor: ProfileAttributesManagementDescriptor,
      columns: ProfileAttributesManagementDescriptor.columns,
      attributeTypeValues: ProfileAttributesManagementDescriptor.attributeTypeValues,
      headers: ProfileAttributesManagementDescriptor.headers,
      loading: false,
      hideForm: false,
      isDirty: false,
      disableLov: true,
      enableLov: true,
      LovSelectHidden: true,
    };
  },
  validations() {
    return {
      attribute: {
        attributeName: {
          required: helpers.withMessage(this.$t("common.validation.required"), required),
        },
        attributeDescription: {
          required: helpers.withMessage(this.$t("common.validation.required"), required),
        },
        value: {},
        lov: {},
        lovId: {},
        multivalue: {},
        allowUser: {},
      },
    };
  },
  async created() {
    await this.loadLovs();
  },
  methods: {
    async loadLovs() {
      this.loading = true;
      await axios
        .get(this.apiUrl + "lovs/get/all")
        .then((response) => {
          this.lovs = response.data;
        })
        .finally(() => (this.loading = false));
    },
    resetForm() {
      Object.keys(this.attribute).forEach((k) => delete this.attribute[k]);
      Object.keys(this.tempAttribute).forEach((k) => delete this.tempAttribute[k]);
    },
    showForm() {
      this.hideLovDropdown();
      this.resetForm();
      this.hideForm = false;
    },
    async save() {
      let response: AxiosResponse;
      if (this.attribute.attributeId != null) {
        response = await axios.put(
          this.apiUrl + "attributes/" + this.attribute.attributeId,
          this.attribute,
          this.headers
        );
      } else {
        response = await axios.post(
          this.apiUrl + "attributes/",
          this.attribute,
          this.headers
        );
      }
      if (response.status == 200) {
        if (response.data.errors) {
          console.log(response.data.errors);
        } else {
          this.$store.commit("setInfo", {
            title: this.$t("managers.profileAttributesManagement.info.updateTitle"),
            msg: this.$t("managers.profileAttributesManagement.info.updateMessage"),
          });
        }
      }

      this.$emit("refreshRecordSet");
      this.resetForm();
    },
    async deleteAttribute(id: number) {
      this.$confirm.require({
        message: this.$t("managers.profileAttributesManagement.confirmDeleteMessage",
          {
            item: "attribute",
          }
        ),
        header: this.$t("common.confirmation"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {
          this.loading = true;
          this.axios
            .delete(this.apiUrl + "attributes/" + id)
            .then(() => {
              this.$store.commit("setInfo", {
                title: this.$t("managers.profileAttributesManagement.info.deleteTitle"),
                msg: this.$t("managers.profileAttributesManagement.info.deleteMessage"),
              });
              this.$emit("refreshRecordSet");
            })
            .finally(() => {
              this.loading = false;
            });
        },
      });
    },
    closeForm() {
      this.$emit("closesForm");
    },
    onAttributeSelect(event: any) {
      if (typeof this.tempAttribute.value === "object" && this.tempAttribute.value !== null) {
        this.tempAttribute.value = this.tempAttribute.value["name"];
      }

      this.isDirty = this.isFormDirty();

      if (this.isDirty) {
        this.$confirm.require({
          message: this.$t("managers.usersManagement.unsavedChangesMessage"),
          header: this.$t("managers.usersManagement.unsavedChangesHeader"),
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            this.populateForm(event.data);
          },
          reject: () => {
            this.isDirty = false;
          },
        });
      } else {
        this.populateForm(event.data);
      }
    },
    populateForm(attribute: iAttribute) {
      this.hideLovDropdown();
      this.hideForm = false;

      this.attribute = { ...attribute };
      this.tempAttribute = { ...attribute };

      if (typeof attribute.value === "object" && attribute.value !== null) {
        this.attribute.value = attribute.value["type"].toUpperCase();
      }

      if (attribute.lovId !== null) {
        this.disableLovs();
        this.showLovDropdown();
      } else {
        this.enableLovs();
      }
    },
    isFormDirty() {
      return (JSON.stringify(this.attribute) !== JSON.stringify(this.tempAttribute));
    },
    hideLovDropdown() {
      this.attribute.lovId = null;
      this.enableLovs();
      this.LovSelectHidden = true;
    },
    showLovDropdown() {
      this.disableLovs();
      this.LovSelectHidden = false;
    },
    disableLovs() {
      this.enableLov = false;
      this.disableLov = true;
    },
    enableLovs() {
      this.enableLov = true;
      this.disableLov = false;
    },
  },
});
</script>


<style lang="scss" scoped>
.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media screen and (max-width: 960px) {
    align-items: start;
  }
}

.record-image {
  width: 50px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.p-dialog .record-image {
  width: 50px;
  margin: 0 auto 2rem auto;
  display: block;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
}
@media screen and (max-width: 960px) {
  ::v-deep(.p-toolbar) {
    flex-wrap: wrap;

    .p-button {
      margin-bottom: 0.25rem;
    }
  }
}
</style>
