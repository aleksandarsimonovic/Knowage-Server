import { mount } from '@vue/test-utils';
import axios from 'axios';
import Button from 'primevue/button';
import flushPromises from 'flush-promises';
import InputText from 'primevue/inputtext';
import Metadata from './Metadata.vue';
import ProgressBar from 'primevue/progressbar';
import Toolbar from 'primevue/toolbar';

const mockedMetadata = [
  {
    id: 1,
    label: 'metadata1',
    name: 'name1',
    description: 'description1',
    dataType: 'SHORT_TEXT'
  },
  {
    id: 2,
    label: 'metadata2',
    name: 'name2',
    description: 'description2',
    dataType: 'SHORT_TEXT'
  },
  {
    id: 5,
    label: 'metadata3',
    name: 'name3',
    description: 'description3',
    dataType: 'FILE'
  }
];

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockedMetadata })),
  delete: jest.fn(() => Promise.resolve())
}));

const $confirm = {
  require: jest.fn()
};

const $store = {
  commit: jest.fn()
};

const factory = () => {
  return mount(Metadata, {
    global: {
      plugins: [],
      stubs: {
        Button,
        InputText,
        ProgressBar,
        Toolbar
      },
      mocks: {
        $t: msg => msg,
        $store,
        $confirm
      }
    }
  });
};

afterEach(() => {
  jest.clearAllMocks();
});

describe('Metadata Management loading', () => {
  it('show progress bar when loading', () => {
    const wrapper = factory();

    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.find('[data-test="progress-bar"]').exists()).toBe(true);
  });
  it('shows "no data" label when loaded empty', async () => {
    axios.get.mockReturnValueOnce(
      Promise.resolve({
        data: []
      })
    );
    const wrapper = factory();

    await flushPromises();

    expect(wrapper.vm.metadataList.length).toBe(0);
    expect(wrapper.find('[data-test="metadata-table"]').html()).toContain(
      'common.info.noDataFound'
    );
  });
});

describe('Metadata Management', () => {
  it('deletes metadata after clicking on delete icon', async () => {
    const wrapper = factory();
    await flushPromises();

    const deleteButton = wrapper.find('[data-test="delete-button"]');
    await deleteButton.trigger('click');

    expect($confirm.require).toHaveBeenCalledTimes(1);

    await wrapper.vm.deleteMetadata(1);
    expect(axios.delete).toHaveBeenCalledTimes(1);
    expect(axios.delete).toHaveBeenCalledWith(
      process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/objMetadata/' + 1
    );
  });

  it('adds empty card with inputs and tabs in detail when the "+" button is clicked', async () => {
    const wrapper = factory();
    const openButton = wrapper.find('[data-test="open-form-button"]');

    await openButton.trigger('click');

    expect(wrapper.vm.formVisible).toBe(true);
    expect(wrapper.find('[data-test="metadata-form"]').exists()).toBe(true);
  });

  // TOASK no child routes WRONG API
  xit('changes url with clicked row id when a row is clicked', () => {});

  // split into two
  xit('shows filled inputs card with clicked row data', async () => {

  });

   it('shows selects correct metadata object when clicked row data', async () => {
     const wrapper = factory();
     await flushPromises();
     const dataTable = wrapper.find('[data-test="metadata-table"]');
     await dataTable.find('tr td').trigger('click');

     expect(wrapper.vm.formVisible).toBe(true);
     expect(wrapper.vm.selectedMetadata).toStrictEqual({
       id: 1,
       label: 'metadata1',
       name: 'name1',
       description: 'description1',
       dataType: 'SHORT_TEXT'
     });
   });
});

describe('Metadata Management Search', () => {
  it('filters the list if a label (or other column) is provided', async () => {
    const wrapper = factory();
    await flushPromises();
    const dataTable = wrapper.find('[data-test="metadata-table"]');
    const inputSearch = wrapper.find('[data-test="search-input"]');

    expect(dataTable.html()).toContain('metadata1');
    expect(dataTable.html()).toContain('metadata2');
    expect(dataTable.html()).toContain('metadata3');

    // Label
    await inputSearch.setValue('metadata1');
    expect(dataTable.html()).toContain('metadata1');
    expect(dataTable.html()).not.toContain('metadata2');
    expect(dataTable.html()).not.toContain('metadata3');

    // Name
    await inputSearch.setValue('name2');
    expect(dataTable.html()).not.toContain('metadata1');
    expect(dataTable.html()).toContain('metadata2');
    expect(dataTable.html()).not.toContain('metadata3');

    // Description
    await inputSearch.setValue('description3');
    expect(dataTable.html()).not.toContain('metadata1');
    expect(dataTable.html()).not.toContain('metadata2');
    expect(dataTable.html()).toContain('metadata3');

    // DataType
    await inputSearch.setValue('SHORT_TEXT');
    expect(dataTable.html()).toContain('metadata1');
    expect(dataTable.html()).toContain('metadata2');
    expect(dataTable.html()).not.toContain('metadata3');
  });
  it('returns no data if the label is not present', async () => {
    const wrapper = factory();
    await flushPromises();
    const dataTable = wrapper.find('[data-test="metadata-table"]');
    const inputSearch = wrapper.find('[data-test="search-input"]');

    expect(dataTable.html()).toContain('metadata1');
    expect(dataTable.html()).toContain('metadata2');
    expect(dataTable.html()).toContain('metadata3');

    await inputSearch.setValue('not present value');
    expect(dataTable.html()).not.toContain('metadata1');
    expect(dataTable.html()).not.toContain('metadata2');
    expect(dataTable.html()).not.toContain('metadata3');
  });
});
