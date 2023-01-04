<template>
    <b-overlay
        :show="loading"
        rounded="sm"
        spinner-variant="primary"
    >
        <div v-if="items.length" class="d-flex justify-content-center mt-5">
            <h5 class="text-primary font-weight-bold">
                Your recipes <b-badge variant="primary" class="ml-3 mt-1">{{ items.length }}</b-badge>
            </h5>
        </div>

        <div v-if="!loading && !items.length" class="d-flex justify-content-center mt-5">
            <h5 class="text-danger font-weight-bold">
                No recipes found...
            </h5>
        </div>

        <div v-if="sortActive" class="d-flex justify-content-center mt-2">
            <b-alert show variant="primary">
                {{ `Sorting by: "${translations[sortOptions.sortBy].toLowerCase()}", in "${translations[sortOptions.order].toLowerCase()}" order` }}
            </b-alert>
        </div>

        <div v-if="filters.isActive" class="d-flex justify-content-center mt-2">
            <b-alert show variant="primary">
                {{ `Filtering by: ${filters.activeFilters}` }}
            </b-alert>
        </div>

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
    import { localAPI } from '../services/api';
    import { mapGetters } from 'vuex';

    export default {
        components: {
            RecipeCard,
        },
        props: {
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
                sortOptions: 'getSortOptions',
                filterOptions: 'getFilterOptions',
                translations: 'getTranslations',
            }),
            sortActive() {
                const { sortBy, order } = this.sortOptions;
                return Boolean(sortBy.length && order.length);
            },
            filters() {
                const activeFilterKeys = Object.keys(this.filterOptions).filter(key => Array.isArray(this.filterOptions[key]) ? this.filterOptions[key].length : this.filterOptions[key]);
                const activeFilters = activeFilterKeys.map(key => {
                    const values = Array.isArray(this.filterOptions[key]) ? this.filterOptions[key].join(', ') : this.filterOptions[key];
                    return `"${this.translations[key].toLowerCase()}": ${values}`;
                }).join(', ');

                return {
                    isActive: Boolean(activeFilterKeys.length),
                    activeFilterKeys,
                    activeFilters,
                };
            },
            items() {
                const searched = this.recipes.filter(recipe => recipe.name.toLowerCase().includes(this.search.toLowerCase()));

                const filtered = this.filterItems(searched);

                let { sortBy, order } = this.sortOptions;

                if (!sortBy) {
                    const { sortBy: initialOrderBy, order: initialOrder } = this.initialSorting;
                    sortBy = initialOrderBy;
                    order = initialOrder;
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

                const response = await localAPI.get(`/recipes?_sort=${this.initialSorting.sortBy}&_order=${this.initialSorting.order}`);

                this.recipes = response.data.map(recipe => ({
                    ...recipe,
                    updated: recipe.updated ?? 0,
                    forServing: recipe.forServing ?? 0
                }));

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
                if (!this.filters.isActive) {
                    return collection;
                }

                const selectedFilterOptions = this.filters.activeFilterKeys;

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