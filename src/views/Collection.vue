<template>
    <List
        ref="list"
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
            filterOptions: {
                type: Object,
                default: () => ({}),
            },
        },
    };
</script>
