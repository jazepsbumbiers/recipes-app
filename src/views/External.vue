<template>
    <List
        ref="apiList"
        :saved-recipes="savedRecipes"
        @items-loaded="(items) => $emit('items-loaded', items)"
        @item-saved-to-collection="itemSavedToCollection"
    />
</template>

<script>
    import List from '@/components/API/List';

    export default {
        components: {
            List,
        },
        data() {
            return {
                savedRecipes: [],
            };
        },
        mounted() {
            this.savedRecipes = JSON.parse(sessionStorage.getItem('saved-recipes') ?? "[]");
        },
        methods: {
            itemSavedToCollection(recipe) {
                this.savedRecipes.push(recipe);
                sessionStorage.setItem('saved-recipes', JSON.stringify(this.savedRecipes));
            },
        },
    };
</script>