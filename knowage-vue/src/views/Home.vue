<template>
	<h1>{{ $t('language.languageSelection') }} - {{ getDate() }}</h1>
	<div class="home">
		<HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
	</div>
	<button @click="errorTest">error</button>
</template>

<script lang="ts">
	import { defineComponent } from 'vue'
	import { formatDate } from '@/helpers/commons/localeHelper'

	export default defineComponent({
		name: 'Home',
		components: {},
		props: {
			msg: {
				type: String,
				required: false
			}
		},
		methods: {
			getDate() {
				return formatDate(undefined, 'LLL')
			},
			errorTest() {
				this.$store.commit('setError', { title: 'Example Error', msg: 'Example error message' })
			}
		}
	})
</script>
