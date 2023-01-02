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

        <b-form-group>
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

    export default {
        data() {
            return {
                sortBy: '',
                order: 'ASC',
                sortableItems: [
                    {
                        value: 'name',
                        text: 'Name',
                    },
                    {
                        value: 'rating',
                        text: 'Rating',
                    },
                    {
                        value: 'forServing',
                        text: 'Count of people to serve',
                    },
                    {
                        value: 'added',
                        text: 'Added at',
                    },
                    {
                        value: 'updated',
                        text: 'Updated at',
                    },
                ],
                orderItems: [
                    {
                        value: 'ASC',
                        text: 'Ascending',
                    },
                    {
                        value: 'DESC',
                        text: 'Descending',
                    },
                ],
            };
        },
        computed: {
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