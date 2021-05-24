<template>
  <div class="kn-page">
    <div class="kn-page-content p-grid p-m-0">
      <div class="kn-list--column p-col-6 p-sm-6 p-md-6 p-p-0">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #left>
            {{ $t('managers.metadata.title') }}
          </template>
          <template #right>
            <KnFabButton
              icon="fas fa-plus"
              @click="showForm"
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
        <div class="p-col">
          <DataTable
            :value="metadataList"
            :paginator="true"
            :rows="20"
            class="p-datatable-sm kn-table"
            dataKey="id"
            v-model:filters="filters"
            filterDisplay="menu"
            :globalFilterFields="metadataDescriptor.globalFilterFields"
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
            data-test="metadata-table"
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
              v-for="col of metadataDescriptor.columns"
              :field="col.field"
              :header="$t(col.header)"
              :key="col.field"
              :headerStyle="metadataDescriptor.table.column.style"
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
            <Column :style="metadataDescriptor.table.iconColumn.style">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-link"
                  @click="deleteMetadataConfirm(slotProps.data.id)"
                  :data-test="'delete-button'"
                />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
      <div
        class="kn-list--column p-col-6 p-sm-6 p-md-6 p-p-0"
        v-if="formVisible"
        data-test="metadata-form"
      >
        <MetadataForm
          :model="selectedMetadata"
          @close="closeForm"
          @saved="reloadMetadata"
          @touched="touched = true"
        ></MetadataForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { iMetadata } from './Metadata';
import { FilterOperator } from 'primevue/api';
import { filterDefault } from '@/helpers/commons/filterHelper';
import axios from 'axios';
import Column from 'primevue/column';
import DataTable from 'primevue/datatable';
import KnFabButton from '@/components/UI/KnFabButton.vue';
import metadataDescriptor from './MetadataDescriptor.json';
import MetadataForm from './MetadataForm.vue';

export default defineComponent({
  components: { Column, DataTable, KnFabButton, MetadataForm },
  data() {
    return {
      metadataDescriptor: metadataDescriptor,
      metadataList: [] as iMetadata[],
      filters: {
        global: [filterDefault],
        label: {
          operator: FilterOperator.AND,
          constraints: [filterDefault]
        },
        name: {
          operator: FilterOperator.AND,
          constraints: [filterDefault]
        },
        description: {
          operator: FilterOperator.AND,
          constraints: [filterDefault]
        },
        dataType: {
          operator: FilterOperator.AND,
          constraints: [filterDefault]
        }
      },
      formVisible: false,
      loading: false,
      touched: false,
      selectedMetadata: {} as iMetadata
    };
  },
  created() {
    this.loadAllMetadata();
  },
  methods: {
    async loadAllMetadata() {
      this.loading = true;
      this.metadataList = [];
      await axios
        .get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/objMetadata')
        .then(response =>
          response.data.map((metadata: any) => {
            this.metadataList.push({
              id: metadata.objMetaId,
              label: metadata.label,
              name: metadata.name,
              description: metadata.description,
              dataType: metadata.dataTypeCode
            });
          })
        )
        .finally(() => (this.loading = false));
    },
    showForm(event: any) {
      if (!this.touched) {
        this.setSelectedMetadata(event);
      } else {
        this.$confirm.require({
          message: this.$t('managers.metadata.confirmUnsavedChangesMessage'),
          header: this.$t('managers.metadata.unsavedChangesHeader'),
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.touched = false;
            this.setSelectedMetadata(event);
          }
        });
      }
    },
    deleteMetadataConfirm(metadataId: number) {
      this.$confirm.require({
        message: this.$t('common.toast.deleteMessage'),
        header: this.$t('common.toast.deleteTitle'),
        icon: 'pi pi-exclamation-triangle',
        accept: () => this.deleteMetadata(metadataId)
      });
    },
    async deleteMetadata(metadataId: number) {
      await axios
        .delete(
          process.env.VUE_APP_RESTFUL_SERVICES_PATH +
            '2.0/objMetadata/' +
            metadataId
        )
        .then(() => {
          this.$store.commit('setInfo', {
            title: this.$t('common.toast.deleteTitle'),
            msg: this.$t('common.toast.deleteSuccess')
          });
          this.loadAllMetadata();
        });
    },
    closeForm() {
      this.formVisible = false;
    },
    reloadMetadata() {
      this.touched = false;
      this.formVisible = false;
      this.loadAllMetadata();
    },
    setSelectedMetadata(event: any) {
      if (event) {
        this.selectedMetadata = event.data;
      }
      this.formVisible = true;
    }
  }
});
</script>

<style lang="scss" scoped>
.kn-list-column {
  border-right: 1px solid #ccc;
}
</style>
