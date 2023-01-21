<template>
    <b-badge :variant="badgeVariant" class="p-2">
        <span class="p-2">
            <span>{{ badgeText }}</span>
        </span>
    </b-badge>
</template>

<script>
    export default {
        props: {
            difficulty: String,
            type: String,
        },
        data() {
            return {
                difficultyVariants: {
                    beginner: 'success',
                    moderate: 'warning',
                    difficult: 'danger',
                },
                typeVariants: {
                    breakfast: 'info',
                    lunch: 'info',
                    dinner: 'info',
                },
            };
        },
        computed: {
            badgeVariant() {
                if (typeof(this.difficulty) !== 'undefined') {
                    return this.difficultyVariants[this.difficulty] ?? 'secondary';
                }

                if (typeof(this.type) !== 'undefined') {
                   return this.typeVariants[this.type] ?? 'secondary';
                }

                return 'secondary';
            },
            badgeText() {
                if (typeof(this.difficulty) !== 'undefined') {
                    return this.difficulty || 'No diff. lvl';
                }

                if (typeof(this.type) !== 'undefined') {
                    return this.type || 'No type';
                }

                return '-';
            },
        },
    };
</script>