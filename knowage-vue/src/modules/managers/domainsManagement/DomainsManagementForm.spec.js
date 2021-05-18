import { mount } from '@vue/test-utils';
import axios from 'axios';
import Button from 'primevue/button';
import DomainsManagementForm from './DomainsManagementForm.vue';
import flushPromises from 'flush-promises';
import InputText from 'primevue/inputtext';

jest.mock('axios', () => ({
  post: jest.fn(() => Promise.resolve()),
  put: jest.fn(() => Promise.resolve())
}));

const $store = {
  commit: jest.fn()
};

const factory = () => {
  return mount(DomainsManagementForm, {
    global: {
      plugins: [],
      stubs: { Button, InputText },
      mocks: {
        $t: msg => msg,
        $store
      }
    }
  });
};

describe('Domains Management Dialog', () => {
  it('save button is disabled if a mandatory input is empty', () => {
    const formWrapper = factory();
    expect(formWrapper.vm.domain).toStrictEqual({});
    expect(formWrapper.vm.buttonDisabled).toBe(true);
  });
  it('close button returns to list without saving data', () => {});
  it('when save button is clicked data is passed', async () => {
    const mockedDomain = {
      valueCd: 'QUERY',
      valueName: 'sbidomains.nm.query',
      domainCode: 'INPUT_TYPE',
      domainName: 'input mode and values',
      valueDescription: 'sbidomains.ds.query'
    };

    const formWrapper = factory();
    formWrapper.vm.domain = mockedDomain;
    formWrapper.vm.v$.$invalid = false;
    formWrapper.vm.handleSubmit();
    await flushPromises();
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(
      process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/domains',
      mockedDomain
    );
    expect($store.commit).toHaveBeenCalledTimes(1);

    mockedDomain.valueId = 1;
    formWrapper.vm.domain = mockedDomain;
    formWrapper.vm.handleSubmit();
    await flushPromises();
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(axios.put).toHaveBeenCalledWith(
      process.env.VUE_APP_RESTFUL_SERVICES_PATH + '2.0/domains/1',
      mockedDomain
    );
    expect($store.commit).toHaveBeenCalledTimes(2);
  });
  it('shows success info if data is saved', () => {
    // tested above
  });
  it('shows error info if save service returns error', () => {
    // not in this component
  });
});
