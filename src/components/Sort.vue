<template>
    <div>
        <h5>Sort by:</h5>

        <b-form-group>
            <b-form-checkbox
                v-for="(item, idx) in sortableItems"
                :key="idx"
                v-model="sortBy"
                :value="item.value"
                unchecked-value=""
                switch
            >
                {{ item.text }}
            </b-form-checkbox>
        </b-form-group>

        <b-form-group label="In order:">
            <b-form-select
                v-model="order"
                :options="orderItems"
            />
        </b-form-group>

        <b-button
            variant="danger"
            size="sm"
            class="mt-2"
            @click="resetOptions"
        >
            Reset
        </b-button>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                sortBy: '',
                order: 'ASC',
            };
        },
        computed: {
            ...mapGetters({
                translations: 'getTranslations',
            }),
            sortableItems() {
                const includableKeys = ['name', 'rating', 'forServing', 'added', 'updated'];
                return Object.keys(this.translations).filter(key => includableKeys.includes(key)).map(key => ({value: key, text: this.translations[key]}));
            },
            orderItems() {
                const includableKeys = ['ASC', 'DESC'];
                return Object.keys(this.translations).filter(key => includableKeys.includes(key)).map(key => ({value: key, text: this.translations[key]}));
            },
            sortOptions() {
                return {
                    sortBy: this.sortBy,
                    order: this.order,
                };
            },
        },
        watch: {
            sortOptions(options) {
                this.setSortOptions(options);
                sessionStorage.setItem('active-sort-options', JSON.stringify(options));
            },
        },
        mounted() {
            const selectedOptions = sessionStorage.getItem('active-sort-options');

            if (selectedOptions) {
                const { sortBy, order } = JSON.parse(selectedOptions);
                this.sortBy = sortBy;
                this.order = order;
            }
        },
        methods: {
            ...mapActions([
                'setSortOptions',
            ]),
            resetOptions() {
                this.sortBy = '';
                this.order = 'ASC';
            },
        },
    };
</script>