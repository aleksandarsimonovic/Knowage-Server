<template>
  <div class="kn-page">
    <Toolbar class="kn-toolbar kn-toolbar--primary">
      <template #left>
        <b style="text-transform: uppercase">
          {{ $t("managers.configurationManagement.title") }}
        </b>
      </template>
      <template #right>
        <KnFabButton icon="fas fa-plus" @click="showForm()" data-test="open-form-button"></KnFabButton>
      </template>
    </Toolbar>
    <ProgressBar mode="indeterminate" class="kn-progress-bar" v-if="loading" data-test="progress-bar"/>
    <div class="kn-page-content p-grid p-m-0">
      <div v-if="!loading">
        <div class="p-col">
          <DataTable
            :value="configurations"
            :paginator="true"
            :loading="loading"
            :rows="20"
            class="p-datatable-sm kn-table"
            dataKey="id"
            v-model:filters="filters"
            filterDisplay="menu"
            :globalFilterFields="configurationManagementDescriptor.globalFilterFields"
            :rowsPerPageOptions="[10, 15, 20]"
            responsiveLayout="stack"
            breakpoint="960px"
            :currentPageReportTemplate="
              $t('common.table.footer.paginated', {
                first: '{first}',
                last: '{last}',
                totalRecords: '{totalRecords}',
              })
            "
            data-test="configurations-table"
            v-model:selection="selectedConfiguration"
            selectionMode="single"
            @rowSelect="showForm"
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
              test
              {{ $t("common.info.dataLoading") }}
            </template>

            <Column
              v-for="col of columns"
              :field="col.field"
              :header="$t(col.header)"
              :key="col.field"
              :sortable="true"
              :style="configurationManagementDescriptor.table.column.style"
            >
              <template #filter="{ filterModel }">
                <InputText
                  type="text"
                  v-model="filterModel.value"
                  class="p-column-filter"
                ></InputText>
              </template>
            </Column>
            <Column :style="configurationManagementDescriptor.table.iconColumn.style" @rowClick="false">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-link"
                  @click="showDeleteDialog(slotProps.data.id)"
                  :data-test="'delete-button'"
                />
              </template>
            </Column>
            
          </DataTable>
        </div>
      </div>
      <div v-if="formVisible">
        <ConfigurationManagementDialog
          :model="selectedConfiguration"
          @created="reload"
          @close="closeForm"
          data-test="configuration-form"
        ></ConfigurationManagementDialog>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { iConfiguration } from "./ConfigurationManagement";
import { FilterOperator } from "primevue/api";
import { filterDefault } from '@/helpers/commons/filterHelper';
import configurationManagementDescriptor from "./ConfigurationManagementDescriptor.json";
import axios from "axios";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import KnFabButton from "@/components/UI/KnFabButton.vue";
import ConfigurationManagementDialog from "./ConfigurationManagementDialog.vue";

export default defineComponent({
  name: "configuration-management",
  components: {
    Column,
    DataTable,
    KnFabButton,
    ConfigurationManagementDialog,
  },
  data() {
    return {
      configurationManagementDescriptor: configurationManagementDescriptor,
      configurations: [] as iConfiguration[],
      selectedConfiguration: null as iConfiguration | null,
      columns: configurationManagementDescriptor.columns,
      formVisible: false,
      loading: false,
      
      filters: {
        global: [filterDefault],
        label: {
          operator: FilterOperator.AND,
          constraints: [filterDefault],
        },
        name: {
          operator: FilterOperator.AND,
          constraints: [filterDefault]
        },
        category: {
          operator: FilterOperator.AND,
          constraints: [filterDefault]
        },
        active: {
          operator: FilterOperator.AND,
          constraints: [filterDefault]
        },
      } as Object,
    };
  },
  created() {
    this.loadConfigurations();
  },
  methods: {
    async loadConfigurations() {
      this.loading = true;
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/configs")
        .then((response) => {
          this.configurations = response.data;
        })
        .finally(() => (this.loading = false));
    },
    showDeleteDialog(configurationId: number) {
      this.$confirm.require({
        message: this.$t("common.toast.deleteMessage"),
        header: this.$t("common.toast.deleteConfirmTitle"),
        icon: "pi pi-exclamation-triangle",
        accept: () => this.deleteConfiguration(configurationId),
      });
    },
    async deleteConfiguration(configurationId: number) {
      await axios
        .delete(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/configs/" + configurationId
        )
        .then(() => {
          this.$store.commit("setInfo", {
            title: this.$t("common.toast.deleteTitle"),
            msg: this.$t("common.toast.deleteSuccess"),
          });
          this.loadConfigurations();
        });
    },

    showForm(event) {
      if (event) {
        this.selectedConfiguration = event.data;
      }
      this.formVisible = true;
    },
    closeForm() {
      this.selectedConfiguration = null;
      this.formVisible = false;
    },
    reload() {
      this.formVisible = false;
      this.loadConfigurations();
    },
  },
});
</script>

<style lang="scss" scoped></style>
