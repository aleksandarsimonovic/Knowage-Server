<template>
  <div class="kn-page">
    <div class="kn-page-content p-grid p-m-0">
      <div class="kn-list--column p-col-4 p-sm-4 p-md-3 p-p-0">
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
              <UsersListBox :users="users" :loading="loading" @selectedUser="onUserSelect" @deleteUser="onUserDelete" data-test="users-listbox"></UsersListBox>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-col-8 p-sm-8 p-md-9 p-p-0 p-m-0" :hidden="hiddenForm">
        <Toolbar class="kn-toolbar kn-toolbar--secondary">
          <template #left>
            {{ userDetailsForm.userId }}
          </template>
          <template #right>
            <Button
              icon="pi pi-save"
              class="kn-button p-button-text p-button-rounded"
              :disabled="v$.userDetailsForm.$invalid"
              @click="saveUser"
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
          <TabView class="tabview-custom" ref="usersFormTab">
            <TabPanel>
              <template #header>
                <span>{{ $t("managers.usersManagement.detail").toUpperCase() }}</span>
              </template>
              <DetailFormTab :formValues="userDetailsForm" :disabledUID="disableUsername" @unlock="unlockUser($event)"></DetailFormTab>
            </TabPanel>

            <TabPanel>
              <template #header>
                <span>{{ $t("managers.usersManagement.roles").toUpperCase()  }}</span>
              </template>

              <RolesTab
                :defRole="defaultRole"
                :rolesList="roles"
                :selected="selectedRoles"
                @changed="setSelectedRoles($event)"
                @setDefaultRole="setDefaultRoleValue($event)"
              ></RolesTab>
            </TabPanel>

            <TabPanel>
               <template #header>
                <span>{{ $t("managers.usersManagement.attributes").toUpperCase() }}</span>
              </template>

              <Card style="width: 100%; margin-bottom: 2em">
                <template #header>
                  <Toolbar class="kn-toolbar kn-toolbar--secondary">
                    <template #left>
                      {{ $t("managers.usersManagement.attributes").toUpperCase() }}
                    </template>
                  </Toolbar>
                </template>
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
                        <label :for="attribute.attributeName">{{ attribute.attributeName  }}</label>
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
import { iUser, iRole, iAttribute } from "./UsersManagement";
import UserService from "./UserService";
import { required, requiredIf, sameAs, minLength, helpers } from "@vuelidate/validators";
import useValidate from "@vuelidate/core";
import axios from "axios";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import KnFabButton from "@/components/UI/KnFabButton.vue";
import RolesTab from "./RolesTab.vue";
import DetailFormTab from "./DetailFormTab.vue";
import UsersListBox from "./UsersListBox.vue";
import usersManagementDescriptor from "./UsersManagementDescriptor.json";
import usersManagementRolesDescriptor from "./UsersManagementRolesDescriptor.json";
export default defineComponent({
  name: "user-management",
  components: {
    UsersListBox,
    TabView,
    TabPanel,
    KnFabButton,
    RolesTab,
    DetailFormTab,
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
      hiddenForm: true,
      disableUsername: true,
      loading: false,
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
    async loadAllUsers() {
      this.loading = true;
      await axios
        .get(this.apiUrl + "users")
        .then((response) => {
          this.users = response.data;
        })
        .finally(() => (this.loading = false));
    },
    async loadAllRoles() {
      this.loading = true;
      await axios
        .get(this.apiUrl + "roles")
        .then((response) => {
          this.roles = response.data;
        })
        .finally(() => (this.loading = false));
    },
    async loadAllAttributes() {
      this.loading = true;
      await axios
        .get(this.apiUrl + "attributes")
        .then((response) => {
          this.attributes = response.data;
        })
        .finally(() => (this.loading = false));
    },
    setDefaultRoleValue(defaultRole : any) {
      this.defaultRole = defaultRole;
    },
    setSelectedRoles(roles : iRole[]) {
      this.selectedRoles = roles;
    },
    onUserDelete(id: number) {
     this.deleteUser(id);
    },
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
    formatSelectedRoles() {
      let selectedRolesFormated: any = [];

      for (let i = 0; i < this.selectedRoles.length; i++) {
        selectedRolesFormated.push(this.selectedRoles[i].id);
      }
      return selectedRolesFormated;
    },
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
    getRoleId() {
      let defaultRoleId: any;
      this.selectedRoles.length == 1
        ? (defaultRoleId = this.selectedRoles[0])
        : (defaultRoleId = this.defaultRole);

      if (typeof defaultRoleId === "object") {
        defaultRoleId = defaultRoleId.id;
      }
      return defaultRoleId;
    },
    formatUserObject() {
      delete this.userDetailsForm.passwordConfirm;
      this.userDetailsForm["defaultRoleId"] = this.getRoleId();
      this.userDetailsForm["sbiUserAttributeses"] = this.formatedAttributesFormValues();
      this.userDetailsForm["sbiExtUserRoleses"] = this.formatSelectedRoles();
    },
    async saveUser() {
      this.loading = true;
      this.formatUserObject();
      let response: any;

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
            console.log(error.response);
          }
        },
      });
    },
    async unlockUser() {
      this.userDetailsForm.failedLoginAttempts = 0;
      await this.saveUser();
    },
    async onUserSelect(userSelected: any) {
      this.formInsert = false;
      let formAttributes = this.formatedAttributesFormValues();
      this.isDirtyAttributes = JSON.stringify(formAttributes) !== JSON.stringify(this.tempAttributes);

      if (this.isDirtyAttributes) {
        this.$confirm.require({
          message: this.$t("managers.usersManagement.unsavedChangesMessage"),
          header: this.$t("managers.usersManagement.unsavedChangesHeader"),
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            this.populateForms(userSelected);
          },
          reject: () => {
            this.isDirtyAttributes = false;
          },
        });
      } else {
        this.populateForms(userSelected);
      }
    },
    populateForms(userObj: any) {
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
    populateAttributesForm(userAttributeValues: any) {
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
    getSelectedUserRoles(userRoles: any) {
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
    eraseAttribute(attr: any) {
      this.attributesForm[attr] = "";
    },
    closeForm() {
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
