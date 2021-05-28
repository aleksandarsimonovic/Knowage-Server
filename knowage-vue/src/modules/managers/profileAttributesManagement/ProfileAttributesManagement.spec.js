import { mount } from "@vue/test-utils";
import axios from "axios";
import Button from "primevue/button";
import flushPromises from "flush-promises";
import ProfileAttributesManagement from "./ProfileAttributesManagement.vue";
import InputText from "primevue/inputtext";
import ProgressBar from "primevue/progressbar";
import Card from "primevue/card";
import Toolbar from "primevue/toolbar";

const mockedAttributes = [
  {
    attributeId: 3,
    attributeName: "address",
    attributeDescription: "address",
    allowUser: null,
    multivalue: null,
    syntax: null,
    lovId: null,
    value: null,
  },
  {
    attributeId: 4,
    attributeName: "birth_date",
    attributeDescription: "birth date",
    allowUser: null,
    multivalue: null,
    syntax: null,
    lovId: null,
    value: null,
  },
  {
    attributeId: 5,
    attributeName: "email",
    attributeDescription: "email",
    allowUser: null,
    multivalue: null,
    syntax: null,
    lovId: null,
    value: null,
  },
];

jest.mock("axios", () => ({
  get: jest.fn(() =>
    Promise.resolve({
      data: mockedAttributes,
    })
  ),
  delete: jest.fn(() => Promise.resolve()),
  post: jest.fn(() => Promise.resolve()),
}));

const $confirm = {
  require: jest.fn(),
};
const $store = {
  commit: jest.fn(),
};

const factory = () => {
  return mount(ProfileAttributesManagement, {
    attachToDocument: true,
    global: {
      plugins: [],
      stubs: { Button, InputText, ProgressBar, Toolbar, Card },
      mocks: {
        $t: (msg) => msg,
        $store,
        $confirm,
      },
    },
  });
};

afterEach(() => {
  jest.clearAllMocks();
});

describe("ProfileAttributes Management loading", () => {
  it("show progress bar when loading", async () => {
    const wrapper = factory();

    expect(wrapper.vm.loading).toBe(true);
    expect(wrapper.find('[data-test="progress-bar"]').exists()).toBe(true);
  });
  it("shows error toast if service returns error", async () => {
    // not in this component
  });
  it('shows "no data" label when loaded empty', async () => {
    axios.get.mockReturnValueOnce(
      Promise.resolve({
        data: [],
      })
    );
    const wrapper = factory();
    await flushPromises();
    expect(wrapper.vm.attributes.length).toBe(0);
    expect(wrapper.find('[data-test="attributes-table"]').html()).toContain(
      "common.info.noDataFound"
    );
  });
});

describe("ProfileAttributes Management", () => {
  it("opens empty form when the '+' button is clicked", async () => {
    const wrapper = factory();
    const openButton = wrapper.find('[data-test="open-form-button"]');
    await openButton.trigger("click");
    expect(wrapper.vm.showForm).toBe(true);
  });

  it("shows form when a row is clicked", async () => {
    const wrapper = factory();
    await flushPromises();
    const dataTable = wrapper.find('[data-test="attributes-table"]');
    await dataTable.find("tr td").trigger("click");

    expect(wrapper.vm.showForm).toBe(false);
    expect(wrapper.vm.attribute).toStrictEqual({
      attributeId: 3,
      attributeName: "address",
      attributeDescription: "address",
      allowUser: null,
      multivalue: null,
      syntax: null,
      lovId: null,
      value: null,
    });
  });
});
