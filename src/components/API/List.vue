<template>
    <b-overlay
        :show="loading"
        rounded="sm"
        spinner-variant="primary"
    >
        <div v-if="items.length">
            <h5 class="d-flex justify-content-center mt-5 text-primary font-weight-bold">
                Found recipes <b-badge variant="primary" class="ml-3 mt-1">{{ items.length }}</b-badge>
            </h5>
        </div>

        <div v-if="!search">
            <h5 class="d-flex justify-content-center mt-5 text-primary font-weight-bold">
                Search for recipes...
            </h5>
        </div>

        <div v-else>
            <h5
                v-if="!loading && !items.length"
                class="d-flex justify-content-center mt-5 text-danger font-weight-bold"
            >
                No recipes found...
            </h5>
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
                        external
                        @item-updated="$emit('item-saved-to-collection', recipe)"
                    />
                </b-col>
            </b-row>
        </b-container>
    </b-overlay>
</template>

<script>
    import RecipeCard from '@/components/RecipeCard';
    import axios from "axios";
    import _ from 'lodash';

    export default {
        components: {
            RecipeCard,
        },
        props: {
            search: {
                type: String,
                default: '',
            },
            savedRecipes: {
                type: Array,
                default: () => ([]),
            },
        },
        data() {
            return {
                loading: false,
                recipes: [],
            };
        },
        computed: {
            items() {
                const savedRecipes = this.savedRecipes.map(recipe => recipe.name);

                if (savedRecipes.length) {
                    return this.recipes.filter(recipe => !savedRecipes.includes(recipe.name));
                }

                return this.recipes;
            },
        },
        watch: {
            search: {
                handler: function(query) {
                    this.searchRecipes(query);
                },
                immediate: true,
            },
        },
        created() {
            this.$emit('items-loaded', [{}]);
        },
        methods: {
            parseResults(results) {
                if (!results) {
                    return [];
                }

                return results.map(result => ({
                    id: parseInt(result.idMeal),
                    name: result.strMeal,
                    type: '',
                    forServing: null,
                    difficultyLevel: '',
                    ingredients: this.getIngredients(result),
                    steps: this.getSteps(result),
                    source: result.strSource || '',
                    image: result.strMealThumb || '',
                    rating: 0,
                }));
            },
            getIngredients(recipe) {
                const ingredientKeys = Object.keys(recipe).filter(key => key.includes('strIngredient'));
                const measureKeys = Object.keys(recipe).filter(key => key.includes('strMeasure'));

                const ingredientValues = ingredientKeys.map(key => recipe[key]).filter(value => value);
                const measureValues = measureKeys.map(key => recipe[key]).filter(value => value);

                let ingredients = [];

                ingredientValues.forEach((ingredient, idx) => {
                    ingredients.push(`${ingredient} (${(measureValues[idx] || '').trim()})`);
                });

                return ingredients;
            },
            getSteps(recipe) {
                return recipe.strInstructions.replace(/(\r\n|\n|\r)/gm, "").split('.').map(i => i.trim()).filter(i => i);
            },
            searchRecipes: _.debounce(async function(query) {
                 if (!query) {
                    this.recipes = [];
                    return;
                }

                this.loading = true;

                const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);

                this.recipes = this.parseResults(response.data.meals);

                this.loading = false;
            }, 750),
        },
    };
</script>

<style>
    /* for centering b-overlay */
    .position-absolute {
        position: fixed !important;
    }
</style>