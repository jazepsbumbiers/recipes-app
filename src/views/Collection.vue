<template>
    <List
        ref="list"
        :search="search"
        :sort-options="sortOptions"
        :filter-options="filterOptions"
        @items-loaded="(items) => $emit('items-loaded', items)"
    />
</template>

<script>
    import List from '@/components/List';

    export default {
        components: {
            List,
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
        },
    };
</script>
