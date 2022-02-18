<template>
    <b-badge
        :variant="variants[difficulty] || 'secondary'"
        pill
        class="p-2"
    >
        <span class="p-2">
            {{ difficulty || 'No difficulty set'}}
        </span>
    </b-badge>
</template>

<script>
    export default {
        props: {
            difficulty: String,
        },
        data() {
            return {
                variants: {
                    beginner: 'success',
                    moderate: 'warning',
                    difficult: 'danger',
                },
            };
        },
    };
</script>