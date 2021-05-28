<template>
  <div class="kn-page">
    <div class="kn-page-content p-grid p-m-0">
      <div class="kn-list--column p-col-5 p-sm-12 p-md-5 p-p-0">
        <Toolbar class="kn-toolbar kn-toolbar--primary">
          <template #left>
            {{ $t("managers.profileAttributesManagement.title") }}
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
                  :style="profileAttributesManagementDescriptor.table.column.style"
                  :sortable="true"
                />

                <Column :style="profileAttributesManagementDescriptor.table.iconColumn.style">
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

      <div class="kn-list--column p-col-7 p-sm-12 p-md-7 p-p-0" :hidden="hideForm">
        <ProfileAttributesForm :selectedAttribute="attribute" @refreshRecordSet="loadAllAttributes" @closesForm="closeForm"></ProfileAttributesForm>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import KnFabButton from "@/components/UI/KnFabButton.vue";
import { FilterMatchMode, FilterOperator } from "primevue/api";
import ProfileAttributesManagementDescriptor from "./ProfileAttributesManagementDescriptor.json";
import { iAttribute } from "./ProfileAttributesManagement";
import ProfileAttributesForm from "./ProfileAttributesForm.vue";

export default defineComponent({
  name: "profile-attributes",
  components: {
    Column,
    DataTable,
    KnFabButton,
    ProfileAttributesForm,
  },
  data() { 
    return {
      apiUrl: process.env.VUE_APP_RESTFUL_SERVICES_PATH + "2.0/",
      attributes: [] as iAttribute[],
      attribute: {} as iAttribute,
      tempAttribute: {} as iAttribute, 
      profileAttributesManagementDescriptor: ProfileAttributesManagementDescriptor,
      columns: ProfileAttributesManagementDescriptor.columns,
      loading: false,
      hideForm: false,
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
  async created() {
    await this.loadAllAttributes();
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
    onAttributeSelect(event: any) {
      this.attribute = { ...event.data };
      if(this.hideForm){
        this.hideForm = false;
      }
    },
    showForm() {
      this.hideForm = false;
      this.attribute = {
        'attributeId' : null,
        'attributeName' : '',
        'attributeDescription': '',
        'allowUser': null,
        'multivalue': null,
        'syntax': null,
        'lovId': null,
        'value': {}
      };
    },
    closeForm() {
      this.hideForm = true;
    },
    async deleteAttribute(id: number) {
      this.$confirm.require({
        message: this.$t("managers.profileAttributesManagement.confirmDeleteMessage",
          {
            item: "user",
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
              this.loadAllAttributes();
            })
            .finally(() => {
              this.loading = false;
            });
        },
      });
    }
  }
});
</script>