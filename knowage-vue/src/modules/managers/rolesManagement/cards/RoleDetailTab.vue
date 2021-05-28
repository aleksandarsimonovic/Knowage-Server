<template>
    <Card :style="rolesManagementTabViewDescriptor.card.style">
        <template #content>
            <form class="p-fluid p-m-5">
                <div class="p-field" :style="rolesManagementTabViewDescriptor.pField.style">
                    <span class="p-float-label">
                        <InputText
                            id="name"
                            class="kn-material-input"
                            type="text"
                            v-model.trim="v$.role.name.$model"
                            :class="{
                                'p-invalid': v$.role.name.$invalid
                            }"
                            maxLength="100"
                            @blur="v$.role.name.$touch()"
                            @input="onFieldChange('name', $event.target.value)"
                            data-test="name-input"
                        />
                        <label for="name" class="kn-material-input-label"> {{ $t('managers.rolesManagement.detail.name') }} * </label>
                    </span>
                    <KnValidationMessages
                        :vComp="v$.role.name"
                        :additionalTranslateParams="{
                            fieldName: $t('managers.rolesManagement.detail.name')
                        }"
                    />
                </div>

                <div class="p-field" :style="rolesManagementTabViewDescriptor.pField.style">
                    <span class="p-float-label">
                        <InputText
                            id="code"
                            class="kn-material-input"
                            type="text"
                            v-model.trim="v$.role.code.$model"
                            :class="{
                                'p-invalid': v$.role.code.$invalid
                            }"
                            maxLength="20"
                            @blur="v$.role.code.$touch()"
                            @input="onFieldChange('code', $event.target.value)"
                            data-test="code-input"
                        />
                        <label for="code" class="kn-material-input-label">
                            {{ $t('managers.rolesManagement.detail.code') }}
                        </label>
                    </span>
                    <KnValidationMessages
                        :vComp="v$.role.code"
                        :additionalTranslateParams="{
                            fieldName: $t('managers.rolesManagement.detail.code')
                        }"
                    />
                </div>

                <div class="p-field" :style="rolesManagementTabViewDescriptor.pField.style">
                    <span class="p-float-label">
                        <InputText
                            id="description"
                            class="kn-material-input"
                            type="text"
                            v-model.trim="v$.role.description.$model"
                            :class="{
                                'p-invalid': v$.role.description.$invalid
                            }"
                            maxLength="225"
                            @blur="v$.role.description.$touch()"
                            @input="onFieldChange('description', $event.target.value)"
                            data-test="description-input"
                        />
                        <label for="description" class="kn-material-input-label">
                            {{ $t('managers.rolesManagement.detail.description') }}
                        </label>
                    </span>
                    <KnValidationMessages
                        :vComp="v$.role.description"
                        :additionalTranslateParams="{
                            fieldName: $t('managers.rolesManagement.detail.description')
                        }"
                    />
                </div>

                <div class="p-field" :style="rolesManagementTabViewDescriptor.pField.style">
                    <span class="p-float-label">
                        <Dropdown
                            id="roleTypeID"
                            class="kn-material-input"
                            :options="translatedRoleTypes"
                            optionLabel="VALUE_CD"
                            optionValue="VALUE_ID"
                            v-model="v$.role.roleTypeID.$model"
                            :class="{
                                'p-invalid': v$.role.roleTypeID.$invalid
                            }"
                            @before-show="v$.role.roleTypeID.$touch()"
                            @change="onRoleTypeChange('roleTypeID', 'roleTypeCD', $event)"
                        >
                        </Dropdown>
                        <label for="roleTypeID" class="kn-material-input-label"> {{ $t('managers.rolesManagement.detail.roleTypeID') }} * </label>
                    </span>
                    <KnValidationMessages
                        :vComp="v$.role.roleTypeID"
                        :additionalTranslateParams="{
                            fieldName: $t('managers.rolesManagement.detail.roleTypeID')
                        }"
                    />
                </div>

                <div class="p-field" :style="rolesManagementTabViewDescriptor.pField.style">
                    <span class="p-field-checkbox">
                        <Checkbox id="isPublic" name="isPublic" v-model="role.isPublic" @change="onPublicChange('isPublic')" :binary="true" data-test="is-public-checkbox" />
                        <label for="isPublic">
                            {{ $t('managers.rolesManagement.detail.isPublic') }}
                        </label>
                    </span>
                </div>
            </form>
        </template>
    </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { required } from '@vuelidate/validators'
import { extendedAlphanumeric } from '@/helpers/commons/regexHelper'
import axios from 'axios'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import useValidate from '@vuelidate/core'
import KnValidationMessages from '@/components/UI/KnValidatonMessages.vue'
import rolesManagementTabViewDescriptor from '../RolesManagementTabViewDescriptor.json'

const regex = (value: any) => {
    return extendedAlphanumeric.test(value)
}

export default defineComponent({
    name: 'detail-tab',
    components: {
        Card,
        Dropdown,
        Checkbox,
        KnValidationMessages
    },
    props: {
        selectedRole: {
            type: Object,
            requried: false
        }
    },
    emits: ['changed', 'fieldChanged', 'roleTypeChanged', 'publicChanged'],
    data() {
        return {
            rolesManagementTabViewDescriptor,
            role: {} as any,
            v$: useValidate() as any,
            roleTypes: [] as any,
            translatedRoleTypes: [] as any
        }
    },
    validations() {
        return {
            role: {
                name: {
                    required,
                    regex
                },
                code: {
                    regex
                },
                description: {
                    regex
                },
                roleTypeID: {
                    required
                }
            }
        }
    },
    async mounted() {
        if (this.selectedRole) {
            this.role = { ...this.selectedRole } as any
        }
        await this.loadRoleTypes()
    },
    watch: {
        selectedRole() {
            this.v$.$reset();
            this.role = { ...this.selectedRole } as any
        }
    },
    methods: {
        async loadRoleTypes() {
            await this.loadDomains('ROLE_TYPE').then((response) => {
                this.roleTypes = response.data
                this.translatedRoleTypes = response.data.map((roleType) => {
                    return {
                        VALUE_CD: this.$t(`managers.rolesManagement.rolesDropdown.${roleType.VALUE_CD}`),
                        VALUE_ID: roleType.VALUE_ID
                    }
                })
            })
        },
        onFieldChange(fieldName: string, value: any) {
            console.log(value)
            this.$emit('fieldChanged', { fieldName, value })
        },
        loadDomains(type: string) {
            return axios.get(process.env.VUE_APP_RESTFUL_SERVICES_PATH + `domains/listValueDescriptionByType?DOMAIN_TYPE=${type}`)
        },
        //Moram ovako da saljem CD posto ga nema u eventu, a saljem 2 parametra sa jednim dropdownom
        onRoleTypeChange(roleTypeIDField: string, roleTypeCDField: string, event) {
            const selRoleType = this.roleTypes.find((roleType) => roleType.VALUE_ID === event.value)
            if (selRoleType) {
                this.role.roleTypeCD = selRoleType.VALUE_CD
            }
            const ID = event.value
            const CD = this.role.roleTypeCD
            this.$emit('roleTypeChanged', { roleTypeIDField, roleTypeCDField, ID, CD })
        },
        //Moram ovako da saljem value posto ga nema u eventu iz nekog razloga
        onPublicChange(fieldName: string) {
            const isPublic = this.role.isPublic
            console.log(isPublic)
            this.$emit('publicChanged', { fieldName, isPublic })
        }
    }
})
</script>
