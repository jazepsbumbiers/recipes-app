<template>
    <b-input-group>
        <template #append>
            <b-input-group-text @click="clearSearch">
                <i class="las la-times"></i>
            </b-input-group-text>
        </template>

        <b-form-input
            type="text"
            v-model.trim="query"
            :placeholder="placeholder"
            :disabled="!searchAllowed"
            @input="$emit('searched', query)"
        />
    </b-input-group>
</template>

<script>
    export default {
        props: {
            search: {
                type: String,
                default: '',
            },
            searchAllowed: {
                type: Boolean,
                default: true,
            },
            placeholder: {
                type: String,
                default: 'Search for recipes by name',
            },
        },
        data() {
            return {
                query: this.search,
            };
        },
        watch: {
            search(query) {
                this.query = query;
            },
            query(value) {
                sessionStorage.setItem('active-search-term', value);
            },
        },
        methods: {
            clearSearch() {
                this.query = '';
                this.$emit('searched', this.query);
            },
        },
    };
</script>