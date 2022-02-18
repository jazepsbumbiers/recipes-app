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
                    type: this.sortBy,
                    order: this.order,
                };
            },
        },
        watch: {
            sortOptions(options) {
                sessionStorage.setItem('sorted-options', JSON.stringify(options));
                this.$emit('sorting-active', options);
            },
        },
        mounted() {
            const selectedOptions = sessionStorage.getItem('sorted-options');

            if (selectedOptions) {
                const {type, order} = JSON.parse(selectedOptions);
                this.sortBy = type;
                this.order = order;
            }
        },
        methods: {
            resetOptions() {
                this.sortBy = '';
                this.order = 'ASC';
            },
        },
    };
</script>