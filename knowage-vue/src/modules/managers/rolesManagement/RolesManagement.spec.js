import { mount } from "@vue/test-utils";
import axios from "axios";
import Button from "primevue/button";
import flushPromises from "flush-promises";
import InputText from "primevue/inputtext";
import RolesManagement from "./RolesManagement.vue";
import ProgressBar from "primevue/progressbar";
import Toolbar from "primevue/toolbar";

jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: mockedRoles })),
  delete: jest.fn(() => Promise.resolve()),
}));

const $confirm = {
  require: jest.fn(),
};

const $store = {
  commit: jest.fn(),
};

const mockedRoles = [
    {
        id: 1,
        name: "/kte/admin",
        description: "/kte/admin",
        roleTypeCD: "ADMIN",
        code: null,
        roleTypeID: 28,
        isPublic: false,
    },
    {
        id: 2,
        name: "user",
        description: "user",
        roleTypeCD: "TEST_ROLE",
        code: "1234",
        roleTypeID: 28,
        isPublic: true,
    },
    {
        id: 3,
        name: "test",
        description: "test",
        roleTypeCD: "ADMIN",
        code: "9999",
        roleTypeID: 28,
        isPublic: false,
    }
  ];

const factory = () => {
  return mount(RolesManagement, {
    global: {
      plugins: [],
      stubs: {
        Button,
        InputText,
        ProgressBar,
        Toolbar,
      },
      mocks: {
        $t: (msg) => msg,
        $store,
        $confirm,
      },
    },
  });
};

describe("Roles Management loading", () => {
    it("show progress bar when loading", () => {
        const wrapper = factory();
        console.log(wrapper);
    });
    it("shows error toast if service returns error", () => {});
    it('shows "no data" label when loaded empty', () => {});
});
