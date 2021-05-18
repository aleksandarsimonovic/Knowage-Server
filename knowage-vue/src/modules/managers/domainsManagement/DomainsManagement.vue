<template>
  <div class="kn-page">
    <Toolbar class="kn-toolbar kn-toolbar--primary">
      <template #left>
        {{ $t('managers.domainsManagement.title') }}
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
      <div class="p-col">
        <DataTable
          :value="domains"
          :paginator="true"
          :loading="loading"
          :rows="20"
          class="p-datatable-sm kn-table"
          dataKey="id"
          v-model:filters="filters"
          filterDisplay="menu"
          :globalFilterFields="domainsManagementDescriptor.globalFilterFields"
          :rowsPerPageOptions="[10, 15, 20]"
          responsiveLayout="stack"
          breakpoint="960px"
          :currentPageReportTemplate="
            $t('common.table.footer.paginated', {
              first: '{first}',
              last: '{last}',
              totalRecords: '{totalRecords}'
            })
          "
          @rowClick="showForm($event)"
          data-test="domains-table"
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
            {{ $t('common.info.noDataFound') }}
          </template>
          <template #loading>
            {{ $t('common.info.dataLoading') }}
          </template>

          <Column
            v-for="col of columns"
            :field="col.field"
            :header="col.header"
            :key="col.field"
            :style="domainsManagementDescriptor.table.column.style"
            :sortable="true"
          >
            <template #filter="{filterModel}">
              <InputText
                type="text"
                v-model="filterModel.value"
                class="p-column-filter"
              ></InputText>
            </template>
          </Column>
          <Column :style="domainsManagementDescriptor.table.iconColumn.style">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-link"
                @click="showForm(slotProps)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-link"
                @click="deleteDomainConfirm(slotProps.data.valueId)"
                :data-test="'delete-button'"
              />
            </template>
          </Column>
        </DataTable>
      </div>

      <div v-if="formVisible">
        <domainsManagementForm
          :model="selectedDomain"
          @created="reloadDomains"
          @close="closeForm"
          data-test="domain-form"
        ></domainsManagementForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { iDomain } from './DomainsManagement';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import axios from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import domainsManagementDescriptor from './DomainsManagementDescriptor.json';
import domainsManagementForm from './DomainsManagementForm.vue';
import KnFabButton from '@/components/UI/KnFabButton.vue';

export default defineComponent({
  name: 'domains-management',
  components: {
    Column,
    DataTable,
    domainsManagementForm,
    KnFabButton
  },
  data() {
    return {
      domainsManagementDescriptor: domainsManagementDescriptor,
      columns: [
        {
          field: 'valueCd',
          header: this.$t('managers.domainsManagement.valueCode')
        },
        {
          field: 'valueName',
          header: this.$t('managers.domainsManagement.valueName')
        },
        {
          field: 'domainCode',
          header: this.$t('managers.domainsManagement.domainCode')
        },
        {
          field: 'domainName',
          header: this.$t('managers.domainsManagement.domainName')
        },
        {
          field: 'valueDescription',
          header: this.$t('managers.domainsManagement.valueDescription')
        }
      ],
      domains: [] as iDomain[],
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        valueCd: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        valueName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        domainCode: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        domainName: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        },
        valueDescription: {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }]
        }
      } as Object,
      formVisible: false,
      loading: false,
      selectedDomain: null as iDomain | null
    };
  },
  created() {
    this.loadAllDomains();
  },
  methods: {
    async loadAllDomains() {
      this.loading = true;
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/domains')
        .then(response => {
          this.domains = response.data;
        })
        .finally(() => (this.loading = false));
    },
    deleteDomainConfirm(domainId: number) {
      this.$confirm.require({
        message: this.$t('common.toast.deleteMessage'),
        header: this.$t('common.toast.deleteConfirmTitle'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.deleteDomain(domainId)
      });
    },
    async deleteDomain(domainId: number) {
      await axios
        .delete(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/domains/' + domainId
        )
        .then(() => {
          this.$store.commit('setInfo', {
            title: this.$t('common.toast.deleteTitle'),
            msg: this.$t('common.toast.deleteSuccess')
          });
          this.loadAllDomains();
        });
    },
    showForm(event) {
      if (event) {
        this.selectedDomain = event.data;
      }
      this.formVisible = true;
    },
    closeForm() {
      this.selectedDomain = null;
      this.formVisible = false;
    },
    reloadDomains() {
      this.formVisible = false;
      this.loadAllDomains();
    }
  }
});
</script>
