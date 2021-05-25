<template>
  <div class="kn-page">
    <div class="kn-page-content p-grid p-m-0">
      <div class="kn-list--column p-col-4 p-sm-4 p-md-3 p-p-0">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #left>
            {{ $t('managers.rolesManagement.title') }}
          </template>
          <template #right>
            <FabButton icon="fas fa-plus" @click="showPanel" />
          </template>
        </Toolbar>
        <div class="p-col">
          <ProgressBar
            mode="indeterminate"
            class="kn-progress-bar"
            v-if="loading"
            data-test="progress-bar"
          />
          <div v-if="!loading">
            <div class="p-col">
              <DataTable
                :value="roles"
                class="p-datatable-sm kn-table"
                dataKey="id"
                responsiveLayout="scroll"
                selectionMode="single"
                v-model:filters="filters"
                filterDisplay="menu"
                :globalFilterFields="rolesDecriptor.globalFilterFields"
                @rowClick="showForm($event)"
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
                      />
                    </span>
                  </div>
                </template>

                <template #empty>
                  {{ $t('common.info.noDataFound') }}
                </template>

                <template #loading v-if="loading">
                  {{ $t('common.info.dataLoading') }}
                </template>

                <Column field="name" header="Name" :sortable="true"></Column>
                <Column
                  field="description"
                  header="Description"
                  :sortable="true"
                ></Column>
                <Column field="id">
                  <template #body="slotProps">
                    <Button
                      icon="pi pi-trash"
                      class="p-button-link"
                      @click="deleteRoleConfirm(slotProps.data.id)"
                      :data-test="'delete-button'"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      <div class="p-col-8 p-sm-8 p-md-9 p-p-0 p-m-0" :hidden="hiddenForm">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #right>
            <Button @click="handleSubmit" class="kn-button p-button-text">
              {{ $t('common.save') }}
            </Button>
            <Button class="kn-button p-button-text" @click="hidePanel">
              {{ $t('common.close') }}
            </Button>
          </template>
        </Toolbar>

        <div class="card">
          <TabView class="tabview-custom" ref="tabview4">
            <TabPanel>
              <template #header>
                <span>{{ $t('managers.rolesManagement.detail.title') }}</span>
              </template>
              <Card :style="rolesManagementTabViewDescriptor.card.style">
                <template #content>
                  <form class="p-fluid p-m-5">
                    <div class="p-field" :style="rolesDecriptor.pField.style">
                      <span class="p-float-label">
                        <InputText
                          id="name"
                          class="kn-material-input"
                          type="text"
                          v-model.trim="v$.selectedRole.name.$model"
                          :class="{
                            'p-invalid':
                              v$.selectedRole.name.$invalid &&
                              v$.selectedRole.name.$dirty
                          }"
                          @blur="v$.selectedRole.name.$touch()"
                          @change="setDirty"
                        />
                        <label for="name" class="kn-material-input-label">
                          {{ $t('managers.rolesManagement.detail.name') }} *
                        </label>
                      </span>
                      <KnValidationMessages
                        :vComp="v$.selectedRole.name"
                        :additionalTranslateParams="{
                          fieldName: $t('managers.rolesManagement.detail.name')
                        }"
                      />
                    </div>

                    <div class="p-field" :style="rolesDecriptor.pField.style">
                      <span class="p-float-label">
                        <InputText
                          id="code"
                          class="kn-material-input"
                          type="text"
                          v-model.trim="v$.selectedRole.code.$model"
                          :class="{
                            'p-invalid':
                              v$.selectedRole.code.$invalid &&
                              v$.selectedRole.code.$dirty
                          }"
                          @blur="v$.selectedRole.code.$touch()"
                          @change="setDirty"
                        />
                        <label for="code" class="kn-material-input-label">
                          {{ $t('managers.rolesManagement.detail.code') }}
                        </label>
                      </span>
                      <KnValidationMessages
                        :vComp="v$.selectedRole.code"
                        :additionalTranslateParams="{
                          fieldName: $t('managers.rolesManagement.detail.code')
                        }"
                      />
                    </div>

                    <div class="p-field" :style="rolesDecriptor.pField.style">
                      <span class="p-float-label">
                        <InputText
                          id="description"
                          class="kn-material-input"
                          type="text"
                          v-model.trim="v$.selectedRole.description.$model"
                          :class="{
                            'p-invalid':
                              v$.selectedRole.description.$invalid &&
                              v$.selectedRole.description.$dirty
                          }"
                          @blur="v$.selectedRole.description.$touch()"
                          @change="setDirty"
                        />
                        <label
                          for="description"
                          class="kn-material-input-label"
                        >
                          {{
                            $t('managers.rolesManagement.detail.description')
                          }}
                        </label>
                      </span>
                      <KnValidationMessages
                        :vComp="v$.selectedRole.description"
                        :additionalTranslateParams="{
                          fieldName: $t(
                            'managers.rolesManagement.detail.description'
                          )
                        }"
                      />
                    </div>

                    <!-- Problem sa dropdownom, kako selektovati izbor -->
                    <div class="p-field" :style="rolesDecriptor.pField.style">
                      <span class="p-float-label">
                        <Dropdown
                          id="roleType"
                          class="kn-material-input"
                          :options="roleTypes"
                          optionLabel="VALUE_CD"
                          optionValue="VALUE_CD"
                          v-model.trim="v$.selectedRole.roleType.$model"
                          :class="{
                            'p-invalid':
                              v$.selectedRole.roleType.$invalid &&
                              v$.selectedRole.roleType.$dirty
                          }"
                          @before-show="v$.selectedRole.roleType.$touch()"
                          @change="setDirty"
                        />
                        <label for="roleType" class="kn-material-input-label">
                          {{ $t('managers.rolesManagement.detail.roleType') }} *
                        </label>
                      </span>
                      <KnValidationMessages
                        :vComp="v$.selectedRole.roleType"
                        :additionalTranslateParams="{
                          fieldName: $t(
                            'managers.rolesManagement.detail.roleType'
                          )
                        }"
                      />
                    </div>

                    <div class="p-field" :style="rolesDecriptor.pField.style">
                      <span class="p-float-label">
                        <Checkbox id="isPublic" />
                        <label for="isPublic">{{
                          $t('managers.rolesManagement.detail.isPublic')
                        }}</label>
                      </span>
                    
                    </div>
                  </form>
                </template>
              </Card>
            </TabPanel>
            <TabPanel>
              <template #header>
                <span>{{ $t('managers.rolesManagement.authorizations') }}</span>
              </template>

              <Card :style="rolesManagementTabViewDescriptor.card.style">
                <template #content> AUTHORIZATIONS </template>
              </Card>
            </TabPanel>

            <TabPanel>
              <template #header>
                <span>{{ $t('managers.rolesManagement.businessModels') }}</span>
              </template>

              <Card :style="rolesManagementTabViewDescriptor.card.style">
                <template #header>
                  <Toolbar class="kn-toolbar kn-toolbar--secondary">
                    <template #left>
                      {{
                        $t('managers.rolesManagement.businessModels') +
                          ' ' +
                          $t('managers.rolesManagement.categories')
                      }}
                    </template>
                  </Toolbar>
                </template>
                <template #content>
                  <DataTable
                    :value="businessModelList"
                    v-model:selection="selectedBusinessModels"
                    class="p-datatable-sm kn-table"
                    dataKey="VALUE_ID"
                    :paginator="true"
                    :rows="20"
                    responsiveLayout="stack"
                    breakpoint="960px"
                  >
                    <template #empty>
                      {{ $t('common.info.noDataFound') }}
                    </template>
                    <template #loading v-if="loading">
                      {{ $t('common.info.dataLoading') }}
                    </template>
                    <Column
                      selectionMode="multiple"
                      header="Select All"
                      headerClass="column-header"
                      :style="rolesManagementTabViewDescriptor.column.style"
                    ></Column>
                    <Column
                      field="VALUE_NM"
                      header="Name"
                      headerClass="column-header"
                    ></Column>
                  </DataTable>
                </template>
              </Card>
            </TabPanel>

            <TabPanel>
              <template #header>
                <span>{{ $t('managers.rolesManagement.dataSets') }}</span>
              </template>

              <Card :style="rolesManagementTabViewDescriptor.card.style">
                <template #header>
                  <Toolbar class="kn-toolbar kn-toolbar--secondary">
                    <template #left>
                      {{
                        $t('managers.rolesManagement.dataSets') +
                          ' ' +
                          $t('managers.rolesManagement.categories')
                      }}
                    </template>
                  </Toolbar>
                </template>
                <template #content>
                  <DataTable
                    :value="dataSetList"
                    v-model:selection="selectedDataSets"
                    class="p-datatable-sm kn-table"
                    dataKey="VALUE_ID"
                    :paginator="true"
                    :rows="20"
                    responsiveLayout="stack"
                    breakpoint="960px"
                  >
                    <template #empty>
                      {{ $t('common.info.noDataFound') }}
                    </template>
                    <template #loading v-if="loading">
                      test
                      {{ $t('common.info.dataLoading') }}
                    </template>
                    <Column
                      selectionMode="multiple"
                      header="Select All"
                      headerClass="column-header"
                      :style="rolesManagementTabViewDescriptor.column.style"
                    ></Column>
                    <Column
                      field="VALUE_NM"
                      header="Name"
                      headerClass="column-header"
                    >
                    </Column>
                  </DataTable>
                </template>
              </Card>
            </TabPanel>

            <TabPanel>
              <template #header>
                <span>{{ $t('managers.rolesManagement.kpiCategories') }}</span>
              </template>

              <Card :style="rolesManagementTabViewDescriptor.card.style">
                <template #header>
                  <Toolbar class="kn-toolbar kn-toolbar--secondary">
                    <template #left>
                      {{
                        $t('managers.rolesManagement.kpiCategories') +
                          ' ' +
                          $t('managers.rolesManagement.categories')
                      }}
                    </template>
                  </Toolbar>
                </template>
                <template #content>
                  <DataTable
                    :value="kpiCategoriesList"
                    v-model:selection="selectedKPICategories"
                    class="p-datatable-sm kn-table"
                    dataKey="VALUE_ID"
                    :paginator="true"
                    :rows="20"
                    responsiveLayout="stack"
                    breakpoint="960px"
                  >
                    <template #empty>
                      {{ $t('common.info.noDataFound') }}
                    </template>
                    <template #loading v-if="loading">
                      {{ $t('common.info.dataLoading') }}
                    </template>
                    <Column
                      selectionMode="multiple"
                      header="Select All"
                      headerClass="column-header"
                      :style="rolesManagementTabViewDescriptor.column.style"
                    ></Column>
                    <Column
                      field="VALUE_NM"
                      header="Name"
                      headerClass="column-header"
                    >
                    </Column>
                  </DataTable>
                </template>
              </Card>
            </TabPanel>
          </TabView>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { iRoles } from './RolesManagement';
import { required, maxLength } from '@vuelidate/validators';
import { extendedAlphanumeric } from '@/helpers/commons/regexHelper';
import KnValidationMessages from '@/components/UI/KnValidatonMessages.vue';
import axios from 'axios';
import useValidate from '@vuelidate/core';
import rolesDecriptor from './RolesManagementDescriptor.json';
import rolesManagementTabViewDescriptor from './RolesManagementTabViewDescriptor.json';
import FabButton from '@/components/UI/KnFabButton.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Dropdown from 'primevue/dropdown';
import Checkbox from 'primevue/checkbox';

const regex = (value: any) => {
  return extendedAlphanumeric.test(value);
};

export default defineComponent({
  name: 'roles-management',
  components: {
    KnValidationMessages,
    FabButton,
    DataTable,
    Column,
    Card,
    TabView,
    TabPanel,
    Dropdown,
    Checkbox
  },
  data() {
    return {
      roles: [] as iRoles[],
      roleTypes: [],
      authorizationList: [],
      businessModelList: [],
      dataSetList: [],
      kpiCategoriesList: [],
      loading: false,
      touched: false,
      rolesDecriptor: rolesDecriptor,
      rolesManagementTabViewDescriptor: rolesManagementTabViewDescriptor,
      columns: rolesDecriptor.columns,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
      } as Object,
      hiddenForm: false,
      selectedBusinessModels: [],
      selectedDataSets: [],
      selectedKPICategories: [],
      selectedRole: {} as any,
      roleMetaModelCategories: [] as any[],
      selectedCategories: [] as any[],
      v$: useValidate() as any,
      dirty: false
    };
  },
  validations() {
    return {
      selectedRole: {
        name: {
          required,
          maximumCharacters: maxLength(100),
          regex
        },
        code: {
          maximumCharacters: maxLength(20),
          regex
        },
        description: {
          maximumCharacters: maxLength(225),
          regex
        },
        roleType: {
          required
        }
      }
    };
  },
  async created() {
    await this.loadAllRoles();
    await this.loadAuthorizations();
    await this.loadAllDomainsData();
  },
  methods: {
    async loadAllRoles() {
      this.loading = true;
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/roles')
        .then(response => {
          this.roles = response.data;
        })
        .finally(() => (this.loading = false));
    },
    async loadAuthorizations() {
      this.loading = true;
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + 'authorizations')
        .then(response => {
          this.authorizationList = response.data;
        })
        .finally(() => (this.loading = false));
    },
    async loadAllDomainsData() {
      await this.loadDomains('ROLE_TYPE').then(response => {
        this.roleTypes = response.data;
      });
      await this.loadDomains('BM_CATEGORY').then(response => {
        this.businessModelList = response.data;
      });
      await this.loadDomains('CATEGORY_TYPE').then(response => {
        this.dataSetList = response.data;
      });
      await this.loadDomains('KPI_KPI_CATEGORY').then(response => {
        this.kpiCategoriesList = response.data;
      });
    },
    loadDomains(type: string) {
      return axios
        .get(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH +
            `domains/listValueDescriptionByType?DOMAIN_TYPE=${type}`
        )
        .finally(() => (this.loading = false));
    },
    handleSubmit() {
      this.selectedRole.roleMetaModelCategories = [];

      this.selectedBusinessModels.map((element: any) => {
        this.selectedRole.roleMetaModelCategories.push({
          categoryId: element.VALUE_ID
        });
      });
      this.selectedDataSets.map((element: any) => {
        this.selectedRole.roleMetaModelCategories.push({
          categoryId: element.VALUE_ID
        });
      });
      this.selectedKPICategories.map((element: any) => {
        this.selectedRole.roleMetaModelCategories.push({
          categoryId: element.VALUE_ID
        });
      });
    },
    showForm(event: any) {
      if (!this.touched) {
        this.setSelectedRole(event);
      } else {
        this.$confirm.require({
          message: this.$t('managers.metadata.confirmUnsavedChangesMessage'),
          header: this.$t('managers.metadata.unsavedChangesHeader'),
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.touched = false;
            this.setSelectedRole(event);
          }
        });
      }
    },
    async setSelectedRole(event: any) {
      if (event) {
        this.selectedRole = { ...event.data };

        await this.loadCategories(this.selectedRole.id).then(response => {
          response.data.map((element: any) => {
            this.roleMetaModelCategories.push({
              categoryId: element.categoryId
            });
          });
        });
      }
    },
    loadCategories(id: number) {
      return axios
        .get(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH +
            `2.0/roles/categories/${id}`
        )
        .finally(() => (this.loading = false));
    },
    deleteRoleConfirm(roleId: number) {
      this.$confirm.require({
        message: this.$t('common.toast.deleteMessage'),
        header: this.$t('common.toast.deleteTitle'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.deleteRole(roleId)
      });
    },
    async deleteRole(roleId: number) {
      await axios
        .delete(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/roles/' + roleId
        )
        .then(() => {
          this.$store.commit('setInfo', {
            title: this.$t('common.toast.deleteTitle'),
            msg: this.$t('common.toast.deleteSuccess')
          });
          this.loadAllRoles();
        });
    },
    setDirty() {
      this.touched = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.column-header {
  color: $color-primary !important;
}
</style>
