<template>
    <List
        ref="apiList"
        :search="search"
        :saved-recipes="savedRecipes"
        @items-loaded="(items) => $emit('items-loaded', items)"
        @item-saved-to-collection="$emit('item-saved-to-collection')"
    />
</template>

<script>
    import List from '@/components/API/List';

    export default {
        components: {
            List,
        },
        props: {
            search: {
                type: String,
                default: '',
            },
        },
        data() {
            return {
                savedRecipes: [],
            };
        },
        mounted() {
            this.savedRecipes = JSON.parse(sessionStorage.getItem('displayed-items') || "[]");
        },
    };
</script>