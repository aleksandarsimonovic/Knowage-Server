import { mount } from '@vue/test-utils'
import axios from 'axios'
import Button from 'primevue/button'
import Column from 'primevue/column'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Dropdown from 'primevue/dropdown'
import flushPromises from 'flush-promises'
import InputText from 'primevue/inputtext'
import KnValidationMessages from '@/components/UI/KnValidatonMessages.vue'
import RolesManagementTabView from './RolesManagementTabView.vue'
import ProgressBar from 'primevue/progressbar'
import TabPanel from 'primevue/tabpanel'
import TabView from 'primevue/tabview'
import Toolbar from 'primevue/toolbar'

const mockedBuissnesModelList = [
    {
        VALUE_NM: 'Default Model Category',
        VALUE_DS: 'Default Model Category',
        VALUE_ID: 172,
        VALUE_CD: 'Default Model Category'
    },
    {
        VALUE_NM: 'Examples',
        VALUE_DS: 'Category Meta Model',
        VALUE_ID: 263,
        VALUE_CD: 'Example'
    }
]
const mockedDataSetList = [
    {
        VALUE_NM: 'Default Dataset Category',
        VALUE_DS: 'Default Dataset Category',
        VALUE_ID: 152,
        VALUE_CD: 'Default Dataset Category'
    },
    {
        VALUE_NM: 'Sales',
        VALUE_DS: 'Sales',
        VALUE_ID: 250,
        VALUE_CD: 'Sales'
    }
]
const mockedKpiCategoriesList = [
    {
        VALUE_NM: 'PRODUCT',
        VALUE_DS: 'PRODUCT',
        VALUE_ID: 256,
        VALUE_CD: 'PRODUCT'
    },
    {
        VALUE_NM: 'RICAVI',
        VALUE_DS: 'RICAVI',
        VALUE_ID: 257,
        VALUE_CD: 'RICAVI'
    }
]
const mockedRoleCategories = [
    {
        roleId: 1,
        categoryId: 172
    },
    {
        roleId: 1,
        categoryId: 152
    }
]
const mockedRoleTypes = [
    {
        VALUE_NM: 'Administrative role',
        VALUE_DS: 'Administrative role for developer users',
        VALUE_ID: 28,
        VALUE_CD: 'ADMIN'
    },
    {
        VALUE_NM: 'Developer role',
        VALUE_DS: 'Developer role for developer users',
        VALUE_ID: 29,
        VALUE_CD: 'DEV_ROLE'
    }
]

jest.mock('axios')

axios.get.mockImplementation((url) => {
    switch (url) {
        case process.env.VUE_APP_RESTFUL_SERVICES_PATH + `domains/listValueDescriptionByType?DOMAIN_TYPE=BM_CATEGORY`:
            return Promise.resolve({ data: mockedBuissnesModelList })
        case process.env.VUE_APP_RESTFUL_SERVICES_PATH + `domains/listValueDescriptionByType?DOMAIN_TYPE=CATEGORY_TYPE`:
            return Promise.resolve({ data: mockedDataSetList })
        case process.env.VUE_APP_RESTFUL_SERVICES_PATH + `domains/listValueDescriptionByType?DOMAIN_TYPE=KPI_KPI_CATEGORY`:
            return Promise.resolve({ data: mockedKpiCategoriesList })
        case process.env.VUE_APP_RESTFUL_SERVICES_PATH + `domains/listValueDescriptionByType?DOMAIN_TYPE=ROLE_TYPE`:
            return Promise.resolve({ data: mockedRoleTypes })
        case process.env.VUE_APP_RESTFUL_SERVICES_PATH + `2.0/roles/categories/1`:
            return Promise.resolve({ data: mockedRoleCategories })
    }
})

axios.post.mockImplementation(() => Promise.resolve())

const $store = {
    commit: jest.fn()
}

const $router = {
    push: jest.fn()
}

const factory = () => {
    return mount(RolesManagementTabView, {
        global: {
            stubs: {
                Button,
                Column,
                Card,
                Checkbox,
                DataTable,
                Dropdown,
                KnValidationMessages,
                InputText,
                ProgressBar,
                TabPanel,
                TabView,
                Toolbar
            },
            mocks: {
                $t: (msg) => msg,
                $store,
                $router
            }
        }
    })
}

afterEach(() => {
    jest.clearAllMocks()
})

describe('Roles Management Business Models', () => {
    xit('switches to Business Models tab if Business Models is clicked', () => {
    })
    xit("shows 'no data' label when loaded empty", () => {})
    xit('one or more rows are selected if the detail has selections', () => {})
})

describe('Roles Management Datasets', () => {
    xit('switches to Datasets tab if Datasets is clicked', () => {})
    xit("shows 'no data' label when loaded empty", () => {})
    xit('one or more rows are selected if the detail has selections', () => {})
})

describe('Roles Management KPI Categories', () => {
    xit('switches to KPI Categories tab if KPI Categories is clicked', () => {})
    xit("shows 'no data' label when loaded empty", () => {})
    xit('one or more rows are selected if the detail has selections', () => {})
})
