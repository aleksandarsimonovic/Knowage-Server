<template>
  <div class="kn-page">
    <div class="kn-page-content p-grid p-m-0">
      <div class="kn-list--column p-col-4 p-sm-4 p-md-3 p-p-0">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #left>
            {{ $t("managers.rolesManagement.title") }}
          </template>
          <template #right>
            <FabButton icon="fas fa-plus" @click="showForm" />
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
                  {{ $t("common.info.noDataFound") }}
                </template>

                <template #loading v-if="loading">
                  {{ $t("common.info.dataLoading") }}
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

      <div class="p-col-8 p-sm-8 p-md-9 p-p-0 p-m-0">
        <router-view @touched="touched = true" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { FilterMatchMode } from "primevue/api";
import { iRoles } from "./RolesManagement";
import axios from "axios";
import rolesDecriptor from "./RolesManagementDescriptor.json";
import FabButton from "@/components/UI/KnFabButton.vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

export default defineComponent({
  name: "roles-management",
  components: {
    FabButton,
    DataTable,
    Column,
  },
  data() {
    return {
      roles: [] as iRoles[],
      authorizationList: [],
      businessModelList: [],
      dataSetList: [],
      kpiCategoriesList: [],
      loading: false,
      touched: false,
      rolesDecriptor: rolesDecriptor,
      columns: rolesDecriptor.columns,
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      } as Object,
      hiddenForm: false,
      dirty: false,
    };
  },

  async created() {
    await this.loadAllRoles();
    await this.loadAuthorizations();

  },
  methods: {
    async loadAllRoles() {
      this.loading = true;
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/roles")
        .then((response) => {
          this.roles = response.data;
        })
        .finally(() => (this.loading = false));
    },
    async loadAuthorizations() {
      this.loading = true;
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + "authorizations")
        .then((response) => {
          this.authorizationList = response.data;
        })
        .finally(() => (this.loading = false));
    },
    showForm(event: any) {
      const path = event.data ? `/roles/${event.data.id}` : "/roles/new-role";

      if (!this.touched) {
        this.$router.push(path);
      } else {
        this.$confirm.require({
          message: this.$t("managers.metadata.confirmUnsavedChangesMessage"),
          header: this.$t("managers.metadata.unsavedChangesHeader"),
          icon: "pi pi-exclamation-triangle",
          accept: () => {
            this.touched = false;
            this.$router.push(path);
          },
        });
      }
    },
    deleteRoleConfirm(roleId: number) {
      this.$confirm.require({
        message: this.$t("common.toast.deleteMessage"),
        header: this.$t("common.toast.deleteTitle"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.deleteRole(roleId),
      });
    },
    async deleteRole(roleId: number) {
      await axios
        .delete(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/roles/" + roleId
        )
        .then(() => {
          this.$store.commit("setInfo", {
            title: this.$t("common.toast.deleteTitle"),
            msg: this.$t("common.toast.deleteSuccess"),
          });
          this.loadAllRoles();
        });
    },
  },
});
</script>

<style lang="scss" scoped>
.column-header {
  color: $color-primary !important;
}
</style>
