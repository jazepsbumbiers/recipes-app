<template>
    <List
        ref="list"
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
