<template>
    <b-sidebar
        :visible="visible"
        :title="title"
        :lazy="lazy"
        :shadow="shadow"
        :backdrop="backdrop"
        :backdrop-variant="backdropVariant"
        :no-close-on-backdrop="noCloseOnBackdrop"
        :id="id"
        @hidden="$emit('sidebar-closed')"
    >
        <div class="px-3 py-2">
            <slot />
        </div>
    </b-sidebar>
</template>

<script>
    export default {
        props: {
            visible: {
                type: Boolean,
                default: false,
            },
            title: {
                type: String,
                default: '',
            },
            lazy: {
                type: Boolean,
                default: true,
            },
            shadow: {
                type: [Boolean, String],
                default: true,
            },
            backdrop: {
                type: Boolean,
                default: false,
            },
            backdropVariant: {
                type: String,
                default: 'transparent',
            },
            noCloseOnBackdrop: {
                type: Boolean,
                default: true,
            },
            id: {
                type: String,
                default: 'sidebar',
            },
        },
    };
</script>