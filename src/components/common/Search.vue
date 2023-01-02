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
        />
    </b-input-group>
</template>

<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    export default {
        props: {
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
                query: '',
            };
        },
        watch: {
            query(value) {
                this.setSearchTerm(value);
                sessionStorage.setItem('active-search-term', value);
            },
            search(value) {
                this.query = value;
            }
        },
        computed: {
            ...mapGetters({
                search: 'getSearchTerm',
            }),
        },
        methods: {
            ...mapActions([
                'setSearchTerm',
            ]),
            clearSearch() {
                this.query = '';
            },
        },
    };
</script>