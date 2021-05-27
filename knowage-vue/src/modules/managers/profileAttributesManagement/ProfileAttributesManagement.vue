<template>
  <div class="kn-page">
    <div class="kn-page-content p-grid p-m-0">
      <div class="kn-list--column p-col-5 p-sm-12 p-md-5 p-p-0">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #left>
            {{ $t("managers.profileAttributesManagement.title") }}
          </template>
          <template #right>
            <KnFabButton
              icon="fas fa-plus"
              @click="showForm()"
              data-test="open-form-button"
            ></KnFabButton>
          </template>
        </Toolbar>
        <ProgressBar
          mode="indeterminate"
          class="kn-progress-bar"
          v-if="loading"
          data-test="progress-bar"
        />
        <div class="kn-page-content p-grid p-m-0">
          <div v-if="!loading">
            <div class="p-col">
              <DataTable
                :value="attributes"
                :paginator="true"
                :rows="10"
                selectionMode="single"
                v-model:filters="filters"
                filterDisplay="menu"
                :globalFilterFields="profileAttributesManagementDescriptor.globalFilterFields"
                @rowSelect="onAttributeSelect"
                class="p-datatable-sm kn-table"
                dataKey="id"
                :rowsPerPageOptions="[10, 15, 20]"
                responsiveLayout="stack"
                breakpoint="960px"
                data-test="attributes-table"
                :currentPageReportTemplate="
                  $t('common.table.footer.paginated', {
                    first: '{first}',
                    last: '{last}',
                    totalRecords: '{totalRecords}',
                  })
                "
              >
                 <template #header>
                  <div class="table-header">
                    <span class="p-input-icon-left">
                      <i class="pi pi-search" />
                      <InputText
                        class="kn-material-input"
                        type="text"
                        v-model="filters['global'].value"
                        :placeholder="$t('common.search')"
                        badge="0"
                        data-test="search-input"
                      />
                    </span>
                  </div>
                </template>
                <template #empty>
                  {{ $t("common.info.noDataFound") }}
                </template>
                <template #loading v-if="loading">
                  {{ $t("common.info.dataLoading") }}
                </template>

                <Column
                  v-for="col of columns"
                  :field="col.field"
                  :header="col.header"
                  :key="col.field"
                  :style="
                    profileAttributesManagementDescriptor.table.column.style
                  "
                  :sortable="true"
                />

                <Column
                  :style="
                    profileAttributesManagementDescriptor.table.iconColumn.style
                  "
                >
                  <template #body="slotProps">
                    <Button
                      icon="pi pi-trash"
                      class="p-button-text p-button-plain"
                      @click="deleteAttribute(slotProps.data.attributeId)"
                      :data-test="'delete-button'"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      <div
        class="kn-list--column p-col-7 p-sm-12 p-md-7 p-p-0"
        :hidden="hideForm"
      >
        <Toolbar class="kn-toolbar kn-toolbar--primary">
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
              <form class="p-fluid p-m-5" ref="profile-attributes-form">
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
                      <label for="attributeName">Name *</label>
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
                      <label for="attributeDescription">Description *</label>
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
                      <label for="dataType">Data type *</label>
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
                    <label for="disableLov">Manual input</label>
                  </div>

                  <div class="p-field-radiobutton p-col-6 p-sm-12 p-md-6">
                    <RadioButton
                      id="lov"
                      name="enableLov"
                      :value="false"
                      v-model="enableLov"
                      @change="showLovDropdown"
                    />
                    <label for="enableLov">Lov</label>
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

                      <label for="attributeDescription">LOV *</label>
                    </span>
                  </div>
                </div>

                <div class="p-inputgroup p-col-6 p-sm-12 p-md-6">
                  <div class="p-field-radiobutton p-col-6 p-sm-12 p-md-6">
                    <InputSwitch v-model="v$.attribute.multivalue.$model" />
                    <i class="pi pi-bars"></i>
                    <label for="multiValue">Multivalue</label>
                  </div>

                  <div class="p-field-radiobutton p-col-6 p-sm-12 p-md-6">
                    <InputSwitch v-model="v$.attribute.allowUser.$model" />
                    <i class="pi pi-eye"></i>
                    <label for="multiValue">Allow user to see field</label>
                  </div>
                </div>
              </form>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import axios, { AxiosResponse } from "axios";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import InputSwitch from "primevue/inputswitch";
import RadioButton from "primevue/radiobutton";
import KnFabButton from "@/components/UI/KnFabButton.vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import ProfileAttributesManagementDescriptor from "./ProfileAttributesManagementDescriptor.json";
import { iAttribute } from "./ProfileAttributesManagement";
import { required, helpers } from "@vuelidate/validators";
import useValidate from "@vuelidate/core";

export default defineComponent({
  name: "user-management",
  components: {
    Column,
    DataTable,
    Dropdown,
    InputSwitch,
    RadioButton,
    KnFabButton,
  },
  data() {
    return {
      v$: useValidate() as any,
      apiUrl: process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/",
      attributes: [] as iAttribute[],
      attribute: {} as iAttribute,
      tempAttribute: {} as iAttribute,
      profileAttributesManagementDescriptor: ProfileAttributesManagementDescriptor,
      columns: ProfileAttributesManagementDescriptor.columns,
      loading: false,
      hideForm: false,
      isDirty: false,
      lovs: [],
      disableLov: true,
      enableLov: true,
      LovSelectHidden: true,
      attributeTypeValues: [
        { name: "String", value: "STRING" },
        { name: "Number", value: "NUM" },
        { name: "Date", value: "DATE" },
      ],
       headers: {
        headers: {
          "Content-Type": "application/json",
        },
      },
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        attributeName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        attributeDescription: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      } as Object,
    };
  },
  validations() {
    return {
      attribute: {
        attributeName: {
          required: helpers.withMessage(
            this.$t("common.validation.required"),
            required
          ),
        },
        attributeDescription: {
          required: helpers.withMessage(
            this.$t("common.validation.required"),
            required
          ),
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
    await this.loadAllAttributes();
    await this.loadLovs();
  },
  methods: {
    async loadAllAttributes() {
      this.loading = true;
      await axios
        .get(this.apiUrl + "attributes")
        .then((response) => {
          this.attributes = response.data;
        })
        .finally(() => (this.loading = false));
    },
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
      Object.keys(this.attribute).forEach(k => delete this.attribute[k]);
      Object.keys(this.tempAttribute).forEach(k => delete this.tempAttribute[k]);
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
            title: this.$t(
              "managers.profileAttributesManagement.info.updateTitle"
            ),
            msg: this.$t(
              "managers.profileAttributesManagement.info.updateMessage"
            ),
          });
        }
      }
      this.loadAllAttributes();
      this.resetForm();
    },
    async deleteAttribute(id: number) {
      this.$confirm.require({
        message: this.$t("managers.profileAttributesManagement.confirmDeleteMessage", {
          item: "user",
        }),
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
              this.loadAllAttributes();
            })
            .finally(() => {
              this.loading = false;
            });
        },
      });
    },
    closeForm() {
      this.hideForm = true;
    },
     onAttributeSelect(event: any) {
      if (
        typeof this.tempAttribute.value === "object" &&
        this.tempAttribute.value !== null
      ) {
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
        this.attribute.value = attribute.value['type'].toUpperCase();
      }

      if (attribute.lovId !== null) {
        this.disableLovs();
        this.showLovDropdown();
      } else {
        this.enableLovs();
      }
    },
    isFormDirty(){
      return JSON.stringify(this.attribute) !== JSON.stringify(this.tempAttribute);
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
    disableLovs(){
      this.enableLov = false;
      this.disableLov = true;
    },
    enableLovs(){
      this.enableLov = true;
      this.disableLov = false;
    }
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
