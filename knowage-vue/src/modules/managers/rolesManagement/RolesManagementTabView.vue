<template>
  <Toolbar class="kn-toolbar kn-toolbar--secondary p-m-0">
    <template #left> Role: {{ selectedRole.name }} </template>
    <template #right>
      <Button
        icon="pi pi-save"
        class="p-button-text p-button-rounded p-button-plain"
        @click="handleSubmit"
        :disabled="buttonDisabled"
      />
      <Button
        icon="pi pi-times"
        class="p-button-text p-button-rounded p-button-plain"
        @click="closeTemplate"
      />
    </template>
  </Toolbar>

  <div class="card">
    <TabView class="tabview-custom" ref="tabview4">
      <TabPanel>
        <template #header>
          <span>{{ $t("managers.rolesManagement.detail.title") }}</span>
        </template>
        <Card :style="rolesManagementTabViewDescriptor.card.style">
          <template #content>
            <form class="p-fluid p-m-5">
              <div
                class="p-field"
                :style="rolesManagementTabViewDescriptor.pField.style"
              >
                <span class="p-float-label">
                  <InputText
                    id="name"
                    class="kn-material-input"
                    type="text"
                    v-model.trim="v$.selectedRole.name.$model"
                    :class="{
                      'p-invalid':
                        v$.selectedRole.name.$invalid &&
                        v$.selectedRole.name.$dirty,
                    }"
                    @blur="v$.selectedRole.name.$touch()"
                    @change="setDirty"
                  />
                  <label for="name" class="kn-material-input-label">
                    {{ $t("managers.rolesManagement.detail.name") }} *
                  </label>
                </span>
                <KnValidationMessages
                  :vComp="v$.selectedRole.name"
                  :additionalTranslateParams="{
                    fieldName: $t('managers.rolesManagement.detail.name'),
                  }"
                />
              </div>

              <div
                class="p-field"
                :style="rolesManagementTabViewDescriptor.pField.style"
              >
                <span class="p-float-label">
                  <InputText
                    id="code"
                    class="kn-material-input"
                    type="text"
                    v-model.trim="v$.selectedRole.code.$model"
                    :class="{
                      'p-invalid':
                        v$.selectedRole.code.$invalid &&
                        v$.selectedRole.code.$dirty,
                    }"
                    @blur="v$.selectedRole.code.$touch()"
                    @change="setDirty"
                  />
                  <label for="code" class="kn-material-input-label">
                    {{ $t("managers.rolesManagement.detail.code") }}
                  </label>
                </span>
                <KnValidationMessages
                  :vComp="v$.selectedRole.code"
                  :additionalTranslateParams="{
                    fieldName: $t('managers.rolesManagement.detail.code'),
                  }"
                />
              </div>

              <div
                class="p-field"
                :style="rolesManagementTabViewDescriptor.pField.style"
              >
                <span class="p-float-label">
                  <InputText
                    id="description"
                    class="kn-material-input"
                    type="text"
                    v-model.trim="v$.selectedRole.description.$model"
                    :class="{
                      'p-invalid':
                        v$.selectedRole.description.$invalid &&
                        v$.selectedRole.description.$dirty,
                    }"
                    @blur="v$.selectedRole.description.$touch()"
                    @change="setDirty"
                  />
                  <label for="description" class="kn-material-input-label">
                    {{ $t("managers.rolesManagement.detail.description") }}
                  </label>
                </span>
                <KnValidationMessages
                  :vComp="v$.selectedRole.description"
                  :additionalTranslateParams="{
                    fieldName: $t(
                      'managers.rolesManagement.detail.description'
                    ),
                  }"
                />
              </div>

              <div
                class="p-field"
                :style="rolesManagementTabViewDescriptor.pField.style"
              >
                <span class="p-float-label">
                  <Dropdown
                    id="roleTypeID"
                    class="kn-material-input"
                    :options="translatedRoleTypes"
                    optionLabel="VALUE_CD"
                    optionValue="VALUE_ID"
                    v-model="v$.selectedRole.roleTypeID.$model"
                    :class="{
                      'p-invalid':
                        v$.selectedRole.roleTypeID.$invalid &&
                        v$.selectedRole.roleTypeID.$dirty,
                    }"
                    @before-show="v$.selectedRole.roleTypeID.$touch()"
                    @change="onRoleTypeChange"
                  >
                  </Dropdown>
                  <label for="roleTypeID" class="kn-material-input-label">
                    {{ $t("managers.rolesManagement.detail.roleTypeID") }} *
                  </label>
                </span>
                <KnValidationMessages
                  :vComp="v$.selectedRole.roleTypeID"
                  :additionalTranslateParams="{
                    fieldName: $t('managers.rolesManagement.detail.roleTypeID'),
                  }"
                />
              </div>

              <div
                class="p-field"
                :style="rolesManagementTabViewDescriptor.pField.style"
              >
                <span class="p-field-checkbox">
                  <Checkbox
                    id="isPublic"
                    name="isPublic"
                    v-model="selectedRole.isPublic"
                    :binary="true"
                  />
                  <label for="isPublic">
                    {{ $t("managers.rolesManagement.detail.isPublic") }}
                  </label>
                </span>
              </div>
            </form>
          </template>
        </Card>
      </TabPanel>

      <TabPanel>
        <template #header>
          <span>{{ $t("managers.rolesManagement.authorizations.title") }}</span>
        </template>

        <Card>
          <template #content>
            <div
              v-for="(category,
              index) of rolesManagementTabViewDescriptor.categories"
              :key="index"
            >
              <template
                v-if="
                  authorizationCBs[category.categoryName] &&
                    authorizationCBs[category.categoryName].length
                "
              >
                <Toolbar class="kn-toolbar kn-toolbar--secondary">
                  <template #left>
                    {{ $t(category.name) }}
                  </template>
                </Toolbar>
                <div
                  v-for="(authCBInfo, index) of authorizationCBs[
                    category.categoryName
                  ]"
                  :key="index"
                >
                  <div class="p-field-checkbox p-m-3">
                    <Checkbox
                      id="binary"
                      v-model="selectedRole[authCBInfo.fieldName]"
                      :binary="true"
                      :disabled="
                        authCBInfo.enableForRole &&
                          !authCBInfo.enableForRole.includes(
                            selectedRole.roleTypeID
                          )
                      "
                    />
                    <label for="binary">{{ $t(authCBInfo.label) }}</label>
                  </div>
                </div>
              </template>
            </div>
          </template>
        </Card>
      </TabPanel>

      <TabPanel>
        <template #header>
          <span>{{ $t("managers.rolesManagement.businessModels") }}</span>
        </template>

        <DomainCategoryTab
          :title="
            $t('managers.rolesManagement.businessModels') +
              ' ' +
              $t('managers.rolesManagement.categories')
          "
          :categoryList="businessModelList"
          :selected="selectedBusinessModels"
          @changed="setSelectedBusinessModels($event)"
        ></DomainCategoryTab>
      </TabPanel>

      <TabPanel>
        <template #header>
          <span>{{ $t("managers.rolesManagement.dataSets") }}</span>
        </template>

        <DomainCategoryTab
          :title="
            $t('managers.rolesManagement.dataSets') +
              ' ' +
              $t('managers.rolesManagement.categories')
          "
          :categoryList="dataSetList"
          :selected="selectedDataSets"
          @changed="setSelectedDataSets($event)"
        ></DomainCategoryTab>
      </TabPanel>

      <TabPanel>
        <template #header>
          <span>{{ $t("managers.rolesManagement.kpiCategories") }}</span>
        </template>

        <DomainCategoryTab
          :title="
            $t('managers.rolesManagement.kpiCategories')
          "
          :categoryList="kpiCategoriesList"
          :selected="selectedKPICategories"
          @changed="setSelectedKPICategories($event)"
        ></DomainCategoryTab>
      </TabPanel>
    </TabView>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { required, maxLength } from "@vuelidate/validators";
import { extendedAlphanumeric } from "@/helpers/commons/regexHelper";
import axios from "axios";
import KnValidationMessages from "@/components/UI/KnValidatonMessages.vue";
// import DataTable from 'primevue/datatable'
// import Column from 'primevue/column'
import Card from "primevue/card";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import rolesManagementTabViewDescriptor from "./RolesManagementTabViewDescriptor.json";
import useValidate from "@vuelidate/core";
import DomainCategoryTab from "./cards/DomainCategoryTab.vue";

const regex = (value: any) => {
  return extendedAlphanumeric.test(value);
};

export default defineComponent({
  components: {
    Card,
    DomainCategoryTab,
    Dropdown,
    Checkbox,
    KnValidationMessages,
    TabView,
    TabPanel,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  emits: ["touched", "closed", "inserted"],
  data() {
    return {
      rolesManagementTabViewDescriptor: rolesManagementTabViewDescriptor,
      roleTypes: [] as any,
      translatedRoleTypes: [] as any,
      selectedBusinessModels: [] as any[], // praviti interfejs za ovo?!!
      selectedDataSets: [] as any[],
      selectedKPICategories: [] as any[],
      selectedRole: {} as any,
      roleMetaModelCategories: [] as any[],
      selectedCategories: [] as any[],
      authorizationList: [] as any,
      authorizationCBs: {} as any,
      businessModelList: [] as any[],
      dataSetList: [] as any[],
      kpiCategoriesList: [] as any[],
      loading: false,
      operation: "insert",
      v$: useValidate() as any,
    };
  },
  validations() {
    return {
      selectedRole: {
        name: {
          required,
          maximumCharacters: maxLength(100),
          regex,
        },
        code: {
          maximumCharacters: maxLength(20),
          regex,
        },
        description: {
          maximumCharacters: maxLength(225),
          regex,
        },
        roleTypeID: {
          required,
        },
      },
    };
  },
  computed: {
    buttonDisabled(): any {
      return this.v$.$invalid;
    },
  },
  watch: {
    id(value) {
      value ? this.loadSelectedRole() : (this.selectedRole = {});
      this.clearSelectedLists();
    },
  },
  async created() {
    await this.loadAllDomainsData();
    await this.loadSelectedRole();
    await this.loadAuthorizations();
    await this.initAuthorizationCB();
  },
  methods: {
    async handleSubmit() {
      if (this.v$.$invalid) {
        return;
      }

      this.selectedRole.roleMetaModelCategories = [];

      this.mapCategories();

      let url = process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/roles/";
      if (this.selectedRole.id) {
        this.operation = "update";
        url += this.selectedRole.id;
      }

      // FOR TESTING
      // if (this.operation == 'insert') {
      //     this.selectedRole.roleTypeCD = 'ADMIN'
      // }

      await axios.post(url, this.selectedRole).then(() => {
        this.$store.commit("setInfo", {
          title: this.$t(
            this.rolesManagementTabViewDescriptor.operation[this.operation]
              .toastTitle
          ),
          msg: this.$t(this.rolesManagementTabViewDescriptor.operation.success),
        });
        this.$emit("inserted");
        this.$router.replace("/roles");
      });
    },
    loadCategories(id: string) {
      return axios
        .get(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH +
            `2.0/roles/categories/${id}`
        )
        .finally(() => (this.loading = false));
    },
    loadDomains(type: string) {
      return axios
        .get(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH +
            `domains/listValueDescriptionByType?DOMAIN_TYPE=${type}`
        )
        .finally(() => (this.loading = false));
    },
    async loadAuthorizations() {
      this.loading = true;
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + "authorizations")
        .then((response) => {
          this.authorizationList = response.data.root;
          console.log(this.authorizationList);
          this.rolesManagementTabViewDescriptor.authorizations.forEach(
            (authorization) => {
              authorization.visible =
                this.authorizationList.findIndex(
                  (auth) => authorization.dbname === auth.name
                ) >= 0;
            }
          );
        })
        .finally(() => (this.loading = false));
    },
    initAuthorizationCB() {
      this.rolesManagementTabViewDescriptor.categories.forEach((category) => {
        this.authorizationCBs[
          category.categoryName
        ] = this.rolesManagementTabViewDescriptor.authorizations.filter(
          (authCB) =>
            authCB.category === category.categoryName && authCB.visible
        );
      });
    },
    async loadAllDomainsData() {
      await this.loadDomains("ROLE_TYPE").then((response) => {
        this.roleTypes = response.data;
        this.translatedRoleTypes = response.data.map((roleType) => {
          return {
            VALUE_CD: this.$t(
              `managers.rolesManagement.rolesDropdown.${roleType.VALUE_CD}`
            ),
            VALUE_ID: roleType.VALUE_ID,
          };
        });
      });
      await this.loadDomains("BM_CATEGORY").then((response) => {
        response.data.map((category: any) => {
          this.businessModelList.push({
            categoryId: category.VALUE_ID,
            categoryName: category.VALUE_NM,
          });
        });
      });
      await this.loadDomains("CATEGORY_TYPE").then((response) => {
        response.data.map((category: any) => {
          this.dataSetList.push({
            categoryId: category.VALUE_ID,
            categoryName: category.VALUE_NM,
          });
        });
      });
      await this.loadDomains("KPI_KPI_CATEGORY").then((response) => {
        response.data.map((category: any) => {
          this.kpiCategoriesList.push({
            categoryId: category.VALUE_ID,
            categoryName: category.VALUE_NM,
          });
        });
      });
    },
    async loadSelectedRole() {
      if (this.id) {
        await axios
          .get(
            process.env.VUE_APP_RESTFUL_SERVICES_PATH + `2.0/roles/${this.id}`
          )
          .then((response) => (this.selectedRole = response.data));

        await this.loadCategories(this.id).then((response) => {
          this.clearSelectedLists();

          response.data.map((category: any) => {
            let index = this.indexInList(category, this.businessModelList);

            if (index != -1) {
              this.selectedBusinessModels.push(this.businessModelList[index]);
            }

            index = this.indexInList(category, this.dataSetList);

            if (index != -1) {
              this.selectedDataSets.push(this.dataSetList[index]);
            }

            index = this.indexInList(category, this.kpiCategoriesList);

            if (index != -1) {
              this.selectedKPICategories.push(this.kpiCategoriesList[index]);
            }
          });
        });
      }
    },
    setDirty() {
      this.$emit("touched");
    },
    onRoleTypeChange(event) {
      this.setDirty();
      const selRoleType = this.roleTypes.find(
        (roleType) => roleType.VALUE_ID === event.value
      );
      if (selRoleType) {
        this.selectedRole.roleTypeCD = selRoleType.VALUE_CD;
      }
    },
    closeTemplate() {
      this.$router.push("/roles");
      this.$emit("closed");
    },
    indexInList(category, list) {
      return list.findIndex((element) => {
        return element.categoryId === category.categoryId;
      });
    },
    clearSelectedLists() {
      this.selectedBusinessModels = [];
      this.selectedDataSets = [];
      this.selectedKPICategories = [];
    },
    mapCategories() {
      if (this.selectedBusinessModels.length > 0) {
        this.selectedBusinessModels.map((category: any) => {
          this.selectedRole.roleMetaModelCategories.push({
            categoryId: category.categoryId,
          });
        });
      }

      if (this.selectedDataSets.length > 0) {
        this.selectedDataSets.map((category: any) => {
          this.selectedRole.roleMetaModelCategories.push({
            categoryId: category.categoryId,
          });
        });
      }

      if (this.selectedKPICategories.length > 0) {
        console.log(this.selectedKPICategories);
        this.selectedKPICategories.map((category: any) => {
          this.selectedRole.roleMetaModelCategories.push({
            categoryId: category.categoryId,
          });
        });
      }
    },
    setSelectedBusinessModels(value) {
      this.selectedBusinessModels = value;
      this.$emit("touched");
      console.log(this.selectedBusinessModels);
    },
    setSelectedDataSets(value) {
      this.selectedDataSets = value;
      this.$emit("touched");
      console.log(this.selectedDataSets);
    },
    setSelectedKPICategories(value) {
      this.selectedKPICategories = value;
      this.$emit("touched");
      console.log(this.selectedKPICategories);
    },
  },
});
</script>
