<template>
    <b-overlay
        :show="loading"
        rounded="sm"
        spinner-variant="primary"
    >
        <div v-if="items.length">
            <h5 class="d-flex justify-content-center mt-5 text-primary font-weight-bold">
                Your recipes <b-badge variant="primary" class="ml-3 mt-1">{{ items.length }}</b-badge>
            </h5>
        </div>

        <h5
            v-if="!loading && !items.length"
            class="d-flex justify-content-center mt-5 text-danger font-weight-bold"
        >
            No recipes found...
        </h5>

        <b-container class="mb-5">
            <b-row>
                <b-col
                    v-for="(recipe, idx) in items"
                    :key="idx"
                    xs="6"
                    sm="6"
                    md="4"
                    lg="3"
                >
                    <RecipeCard
                        :recipe="recipe"
                        @item-updated="fetchData"
                        @item-deleted="fetchData"
                    />
                </b-col>
            </b-row>
        </b-container>
    </b-overlay>
</template>

<script>
    import RecipeCard from '@/components/RecipeCard';
    import axios from "axios";
    import { mapGetters } from 'vuex';

    export default {
        components: {
            RecipeCard,
        },
        props: {
            sortOptions: {
                type: Object,
                default: () => ({}),
            },
            filterOptions: {
                type: Object,
                default: () => ({}),
            },
            initialSorting: {
                type: Object,
                default: () => ({
                    sortBy: 'added',
                    order: 'desc',
                }),
            },
        },
        data() {
            return {
                loading: false,
                recipes: [],
            };
        },
        computed: {
            ...mapGetters({
                search: 'getSearchTerm',
            }),
            items() {
                const searched = this.recipes.filter(recipe => recipe.name.toLowerCase().includes(this.search.toLowerCase()));

                const filtered = this.filterItems(searched);

                const { sortBy, order } = this.sortOptions;

                if (!sortBy) {
                    const { sortBy: initialOrderBy, order: initialOrder } = this.initialSorting;
                    return this.sortItems(initialOrderBy, initialOrder, filtered);
                }

                const sorted = this.sortItems(sortBy, order, filtered);

                return sorted;
            },
        },
        watch: {
            recipes(items) {
                this.$emit('items-loaded', items);
            },
        },
        created() {
            this.fetchData();
        },
        methods: {
            async fetchData() {
                this.loading = true;

                const response = await axios.get(`http://localhost:3000/recipes?_sort=${this.initialSorting.sortBy}&_order=${this.initialSorting.order}`);

                this.recipes = response.data;

                this.loading = false;

                sessionStorage.setItem('saved-recipes', JSON.stringify(this.recipes));
            },
            sortItems(orderBy, order, collection) {
                let sortedItems = [];

                const numberValues = ['rating', 'forServing', 'added', 'updated'];
                const stringValues = ['name'];

                if (numberValues.includes(orderBy)) {
                    sortedItems = collection.sort((a, b) => {
                        return order === 'ASC'
                            ? a[orderBy] - b[orderBy]
                            : b[orderBy] - a[orderBy];
                    });
                } else if (stringValues.includes(orderBy)) {
                    sortedItems = collection.sort((a, b) => {
                        let x = a[orderBy].toUpperCase();
                        let y = b[orderBy].toUpperCase();

                        if (order === 'ASC') {
                            return x == y ? 0 : x > y ? 1 : -1;
                        } else {
                            return x == y ? 0 : x > y ? -1 : 1;
                        }
                    });
                }

                return sortedItems;
            },
            filterItems(collection) {
                const hasFilters = Object.values(this.filterOptions).filter(i => Array.isArray(i) ? i.length : i).length;

                if (!hasFilters) {
                    return collection;
                }

                const selectedFilterOptions = Object.keys(this.filterOptions).filter(key => {
                    const value = this.filterOptions[key];
                    return Array.isArray(value) ? value.length : value;
                });

                const filteredItems = collection.filter(recipe => {
                    return selectedFilterOptions.filter(option => {
                        let condition;

                        if (Array.isArray(this.filterOptions[option])) {
                            const key = option === 'difficulties' ? 'difficultyLevel' : 'type';
                            condition = this.filterOptions[option].includes(recipe[key]);
                        } else {
                            condition = recipe[option] === this.filterOptions[option];
                        }

                        return condition;
                    }).length === selectedFilterOptions.length;
                });

                return filteredItems;
            },
        },
    };
</script>

<style>
    /* for centering b-overlay */
    .position-absolute {
        position: fixed !important;
    }
</style>