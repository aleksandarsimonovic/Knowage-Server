<template>
  <div class="kn-page">
    <div class="kn-page-content p-grid p-m-0">
      <div class="kn-list--column p-col-5 p-sm-12 p-md-5 p-p-0">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #left>
            {{ $t("managers.usersManagement.title") }}
          </template>
          <template #right>
            <KnFabButton icon="fas fa-plus" @click="showForm()" data-test="open-form-button"></KnFabButton>
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
                :value="users"
                :paginator="true"
                :rows="10"
                v-model:selection="selectedUser"
                selectionMode="single"
                @rowSelect="onUserSelect"
                class="p-datatable-sm kn-table"
                dataKey="id"
                v-model:filters="filters"
                :globalFilterFields="usersManagementDescriptor.globalFilterFields"
                filterDisplay="menu"
                :rowsPerPageOptions="[10, 15, 20]"
                responsiveLayout="stack"
                breakpoint="960px"
                data-test="users-table"
                :currentPageReportTemplate="
                  $t('common.table.footer.paginated', {
                    first: '{first}',
                    last: '{last}',
                    totalRecords: '{totalRecords}',
                  })">
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
                  :style="usersManagementDescriptor.table.column.style"
                  :sortable="true"
                >
                  <template #filter="{ filterModel }">
                    <InputText
                      type="text"
                      v-model="filterModel.value"
                      class="p-column-filter"
                    ></InputText>
                  </template>
                </Column>
                <Column :style="usersManagementDescriptor.table.iconColumn.style">
                  <template #body="slotProps">
                     <Button
                      v-if="slotProps.data.failedLoginAttempts >=3"
                      icon="pi pi-lock"
                      class="p-button-danger p-button-text"
                    />
                    <Button
                      icon="pi pi-trash"
                      class="p-button-text p-button-plain"
                      @click="deleteUser(slotProps.data.id)"
                      :data-test="'delete-button'"
                    />
                  </template>
                </Column>
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      <div class="kn-list--column p-col-7 p-sm-12 p-md-7 p-p-0" :hidden="hiddenForm">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #left>
            {{ userDetailsForm.userId }}
          </template>
          <template #right>
            <Button icon="pi pi-save" class="kn-button p-button-text p-button-rounded" :disabled="v$.userDetailsForm.$invalid" @click="saveUser"/>
            <Button class="kn-button p-button-text p-button-rounded" icon="pi pi-times" @click="closeForm"/>
          </template>
        </Toolbar>
        <ProgressBar
          mode="indeterminate"
          class="kn-progress-bar"
          v-if="loading"
          data-test="progress-bar"
        />
        <div class="card">
          <TabView class="tabview-custom" ref="usersFormTab">
            <TabPanel>
              <template #header>
                <span>DETAIL</span>
              </template>

              <Card style="width: 100%; margin-bottom: 2em">
                <template #content>

                  <div class="p-grid p-offset-1" v-if="userDetailsForm.failedLoginAttempts >= 3">
                  <div class="p-col-9 p-md-9">
                    <InlineMessage severity="warn">{{ $t("managers.usersManagement.blockedUserInfo") }}</InlineMessage>
                    </div>
                  <div class="p-col-3 p-md-3">
                    <Button @click="unlockUser" icon="pi pi-lock-open" label="UNLOCK USER" />
                  </div>
                </div>


                  <form class="p-fluid p-m-5" ref="detail-form">

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
                          <label for="userId">User ID *</label>
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
                          <label for="fullName">Full Name *</label>
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
                          <label for="password">Password *</label>
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
                          <label for="passwordConfirm">Confirm Password *</label>
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
            </TabPanel>
            <TabPanel>
              <template #header>
                <span>ROLES</span>
              </template>
              <Card style="width: 100%; margin-bottom: 2em">
                <template #content>
                  <div v-if="selectedRoles.length > 1">
                    <div class="p-inputgroup">
                      <span class="p-float-label">
                        <Dropdown
                          v-model="defaultRole"
                          :options="selectedRoles"
                          optionLabel="name"
                          optionValue="id"
                          class="p-inputtext p-component kn-material-input"
                        />
                        <label for="defaultRole">Default role</label>
                      </span>
                    </div>
                  </div>
                  <p>
                    {{ $t("managers.usersManagement.defaultRoleInfo") }}
                  </p>
                  <DataTable
                    :value="roles"
                    v-model:selection="selectedRoles"
                    class="p-datatable-sm kn-table"
                    dataKey="id"
                    responsiveLayout="stack"
                    breakpoint="960px"
                  >
                    <template #empty>
                      {{ $t("common.info.noDataFound") }}
                    </template>
                    <template #loading v-if="loading">
                      test
                      {{ $t("common.info.dataLoading") }}
                    </template>
                    <Column
                      selectionMode="multiple"
                      headerStyle="width: 3em"
                    ></Column>
                    <Column
                      v-for="col of rolesColumns"
                      :field="col.field"
                      :header="col.header"
                      :key="col.field"
                      :style="usersManagementRolesDescriptor.table.column.style"
                      :sortable="true"
                    >
                    </Column>
                  </DataTable>
                </template>
              </Card>
            </TabPanel>
            <TabPanel>
              <template #header>
                <span>ATTRIBUTES</span>
              </template>

              <Card style="width: 100%; margin-bottom: 2em">
                <template #content>
                  <div
                    class="p-field"
                    v-for="attribute in attributes"
                    :key="attribute.attributeId"
                  >
                    <div class="p-inputgroup">
                      <span class="p-float-label">
                        <InputText
                          class="p-inputtext p-component kn-material-input"
                          :id="attribute.attributeId"
                          type="text"
                          v-model="attributesForm[attribute.attributeName]"
                        />
                        <label :for="attribute.attributeName">{{
                          attribute.attributeName
                        }}</label>
                      </span>
                      <Button
                        icon="pi pi-trash"
                        class="p-button-link"
                        @click="eraseAttribute(attribute.attributeName)"
                      />
                    </div>
                  </div>
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
import { defineComponent } from "vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import { iUser, iRole, iAttribute } from "./UsersManagement";
import UserService from "./UserService";
import { required, requiredIf, sameAs, minLength, helpers } from "@vuelidate/validators";
import useValidate from "@vuelidate/core";

import axios from "axios";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Dropdown from "primevue/dropdown";
import InlineMessage  from 'primevue/inlinemessage';
import KnFabButton from "@/components/UI/KnFabButton.vue";

import usersManagementDescriptor from "./UsersManagementDescriptor.json";
import usersManagementRolesDescriptor from "./UsersManagementRolesDescriptor.json";
export default defineComponent({
  name: "user-management",
  components: {
    Column,
    InlineMessage,
    DataTable,
    TabView,
    TabPanel,
    Dropdown,
    KnFabButton,
  },
  data() {
    return {
      userService: {} as UserService,
      v$: useValidate() as any,
      apiUrl: process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/",
      users: [] as iUser[],
      roles: [] as iRole[],
      attributes: [],
      userDetailsForm: {} as any,
      isDirtyAttributes: false,
      dirty: false,
      formInsert: true,
      attributesForm: {},
      tempAttributes: {},
      defaultRole: null,
      usersManagementDescriptor: usersManagementDescriptor,
      usersManagementRolesDescriptor: usersManagementRolesDescriptor,
      columns: usersManagementDescriptor.columns,
      rolesColumns: usersManagementRolesDescriptor.columns,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        userId: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
        fullName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        },
      } as Object,
      hiddenForm: true,
      disableUsername: true,
      loading: false,
      selectedUser: null as iUser | null,
      selectedRoles: [] as iRole[],
    };
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
  async created() {
    this.userService = new UserService(this.$t);
    await this.loadAllUsers();
    await this.loadAllRoles();
    await this.loadAllAttributes();
  },
  methods: {
    /*
     * 	Loads users
     *
     */
    async loadAllUsers() {
      this.loading = true;
      await axios
        .get(this.apiUrl + 'users')
        .then((response) => {
          this.users = response.data;
        })
        .finally(() => (this.loading = false));
    },
    /*
     * 	Loads roles
     *
     */
    async loadAllRoles() {
      this.loading = true;
      await axios
        .get(this.apiUrl + "roles")
        .then((response) => {
          this.roles = response.data;
        })
        .finally(() => (this.loading = false));
    },
    /*
     * 	Loads attributes
     *
     */
    async loadAllAttributes() {
      this.loading = true;
      await axios
        .get(this.apiUrl + "attributes")
        .then((response) => {
          this.attributes = response.data;
        })
        .finally(() => (this.loading = false));
    },
     /*
     * 	Shows form
     *
     */
    async showForm() {
      this.tempAttributes = {};
      this.attributesForm = {};
      this.disableUsername = false;
      this.hiddenForm = false;
      this.selectedRoles = [];
      this.userDetailsForm.id = null;
      this.userDetailsForm.userId = "";
      this.userDetailsForm.fullName = "";
      this.userDetailsForm.failedLoginAttempts = 0;
      this.formInsert = true;
    },
      /*
     * 	Format selected roles
     *
     */
    formatSelectedRoles() {
      let selectedRolesFormated: any = [];

      for (let i = 0; i < this.selectedRoles.length; i++) {
        selectedRolesFormated.push(this.selectedRoles[i].id);
      }
      return selectedRolesFormated;
    },
    /*
     * 	Format attributes
     *
     */
    formatedAttributesFormValues() {
      let formAttributesValues = {};

      for (const [k, v] of Object.entries(this.attributesForm)) {
        Object.entries(this.attributes).forEach((attr: any) => {
          let attributeName = attr[1]["attributeName"];
          let attributeId = attr[1]["attributeId"];
          if (k == attributeName) {
            let obj: any = {};
            obj[attributeName] = v;
            formAttributesValues[attributeId] = obj;
          }
        });
      }
      return formAttributesValues;
    },
    /*
     * 	Get default roleId
     */
    getRoleId() {
      let defaultRoleId : any;
      this.selectedRoles.length == 1
        ? (defaultRoleId = this.selectedRoles[0])
        : (defaultRoleId = this.defaultRole);

      if (typeof defaultRoleId === "object") {
        defaultRoleId = defaultRoleId.id;
      }
      return defaultRoleId;
    },
    /*
     * 	Format
     *  selected users roles and attributes
     *  for create/update.
     *
     */
    formatUserObject() {
      delete this.userDetailsForm.passwordConfirm;
      this.userDetailsForm["defaultRoleId"] = this.getRoleId();
      this.userDetailsForm["sbiUserAttributeses"] = this.formatedAttributesFormValues();
      this.userDetailsForm["sbiExtUserRoleses"] = this.formatSelectedRoles();
    },
    /*
     * 	Create/update user
     *
     */
    async saveUser() {
     this.loading = true;
      this.formatUserObject();
      let response : any;

      try {
        if (this.userDetailsForm.id != null) {
          response = await this.userService.update(this.userDetailsForm);
        } else {
          response = await this.userService.insert(this.userDetailsForm);
        }

        if (response) {
          this.loadAllUsers();
          this.loading = false;
        }
      } catch (error) {
        console.log(error.response);
      }

      this.attributesForm = {};
      this.tempAttributes = {};
    },
    /*
     * 	Deletes user
     *
     */
    async deleteUser(id: number) {
      this.$confirm.require({
        message: this.$t("managers.usersManagement.confirmDeleteMessage", {
          item: "user",
        }),
        header: this.$t("common.confirmation"),
        icon: "pi pi-exclamation-triangle",
        accept: async () => {

          this.loading = true;

          try {
            let response = await this.userService.delete(id);

            if (response) {
              this.loadAllUsers();
              this.hiddenForm = true;
              this.loading = false;
            }
          } catch (error) {
            console.log(error.response)
          }
        },
      });
    },
    /*
    *  Unlocks user
    *
    */
   async unlockUser(){
      this.userDetailsForm.failedLoginAttempts=0;
      await this.saveUser();
    },
    /*
     * 	On users grid row select populating details, roles and attributes tabs with data
     *
     */
    async onUserSelect(event : any) {
      this.formInsert = false;
      let formAttributes = this.formatedAttributesFormValues();
      this.isDirtyAttributes = JSON.stringify(formAttributes) !== JSON.stringify(this.tempAttributes);

      if (this.isDirtyAttributes) {
        this.$confirm.require({
          message: this.$t("managers.usersManagement.unsavedChangesMessage"),
          header: this.$t("managers.usersManagement.unsavedChangesHeader"),
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            this.populateForms(event.data);
          },
          reject: () => {
            this.isDirtyAttributes = false;
          },
        });
      } else {
        this.populateForms(event.data);
      }
    },
     /*
     * 	Populates form with user details
     */
    populateForms(userObj : any){
      this.tempAttributes = [];
      this.attributesForm = {};

      this.hiddenForm = false;
      this.disableUsername = true;

      let userAttributeValues: iAttribute[] = userObj.sbiUserAttributeses;

      this.tempAttributes = userAttributeValues;

      this.defaultRole = userObj.defaultRoleId;

      this.selectedRoles = this.getSelectedUserRoles(userObj.sbiExtUserRoleses);

      this.userDetailsForm = { ...userObj };

      this.populateAttributesForm(userAttributeValues);
    },
    /*
     * 	Function used to properly fill
     *  attributes with attributes from
     *  selected user
     */
    populateAttributesForm(userAttributeValues : any) {
      let tmpAttributesForm = {};

      this.attributes.forEach(async function (attribute: iAttribute) {
        Object.entries(userAttributeValues).forEach((userAttribute: any) => {
          if (typeof userAttribute[1][attribute.attributeName] != "undefined") {
            tmpAttributesForm[attribute.attributeName] = userAttribute[1];
          }
        });
      });

      Object.entries(tmpAttributesForm).forEach((tmpAttribute: any) => {
        const [key, value] = tmpAttribute;
        this.attributesForm[key] = value[key];
      });
    },
    /*
     * 	this function is used to properly fill
     *  roles table with roles from
     *  selected user
     */
    getSelectedUserRoles(userRoles : any) {
      let selectedRoles: iRole[] = [];
      let roles: iRole[] = this.roles;
      userRoles.forEach(async function (selectedRoleId) {
        roles.forEach(async function (role) {
          if (role.id == selectedRoleId) {
            selectedRoles.push(role);
          }
        });
      });
      return selectedRoles;
    },
    /*
     * 	Clears attribute form value
     */
    eraseAttribute(attr : any) {
      this.attributesForm[attr] = "";
    },
    /*
     * 	Closes form
     */
    closeForm() {
      this.selectedUser = null;
      this.hiddenForm = true;
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
