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

    export default {
        components: {
            RecipeCard,
        },
        props: {
            search: {
                type: String,
                default: '',
            },
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
            items: {
                get() {
                    return this.recipes.filter(
                        recipe => recipe.name.toLowerCase().includes(this.search.toLowerCase())
                    );
                },
                set(values) {
                    this.recipes = values;
                },
            },
        },
        watch: {
            recipes(items) {
                this.$emit('items-loaded', items);
            },
            sortOptions: {
                deep: true,
                async handler(options) {
                    const orderBy = options.type;
                    const order = options.order;

                    if (!orderBy) {
                        const response = await axios.get(`http://localhost:3000/recipes?_sort=${this.initialSorting.sortBy}&_order=${this.initialSorting.order}`);
                        this.items = response.data;
                        sessionStorage.setItem('displayed-items', JSON.stringify(this.items));

                        return;
                    }

                    this.items = this.sortItems(orderBy, order);
                },
            },
            filterOptions: {
                deep: true,
                handler(options) {
                    this.items = this.filterItems(options);
                },
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

                sessionStorage.setItem('displayed-items', JSON.stringify(this.recipes));

                this.loading = false;
            },
            sortItems(orderBy, order) {
                let sortedItems = [];

                const numberValues = ['rating', 'forServing', 'added', 'updated'];
                const stringValues = ['name'];

                if (numberValues.includes(orderBy)) {
                    sortedItems = this.recipes.sort((a, b) => {
                        return order === 'ASC'
                            ? a[orderBy] - b[orderBy]
                            : b[orderBy] - a[orderBy];
                    });
                } else if (stringValues.includes(orderBy)) {
                    sortedItems = this.recipes.sort((a, b) => {
                        let x = a[orderBy].toUpperCase();
                        let y = b[orderBy].toUpperCase();

                        if (order === 'ASC') {
                            return x == y ? 0 : x > y ? 1 : -1;
                        } else {
                            return x == y ? 0 : x > y ? -1 : 1;
                        }
                    });
                }

                sessionStorage.setItem('displayed-items', JSON.stringify(sortedItems));

                return sortedItems;
            },
            filterItems(options) {
                const displayedItems = JSON.parse(sessionStorage.getItem('displayed-items'));

                const hasFilters = Object.values(options).filter(i => Array.isArray(i) ? i.length : i).length;

                if (!hasFilters) {
                    return displayedItems;
                }

                const { types, difficulties, forServing, rating } = options;

                const result = [
                    ...(types.length ? displayedItems.filter(recipe => types.includes(recipe.type)) : []),
                    ...(difficulties.length ? displayedItems.filter(recipe => difficulties.includes(recipe.difficultyLevel)) : []),
                    ...(forServing ? displayedItems.filter(recipe => recipe.forServing === forServing) : []),
                    ...(rating ? displayedItems.filter(recipe => recipe.rating === rating) : [])
                ];

                return Array.from(new Set(result));
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