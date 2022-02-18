<template>
    <div class="observer" />
</template>

<script>
    export default {
        props: {
            options: {
                type: Object,
                default: () => ({}),
            },
        },
        data() {
            return {
                observer: null,
            };
        },
        mounted() {
            this.observer = new IntersectionObserver(([entry]) => {
                if (entry && entry.isIntersecting) {
                    this.$emit("intersected");
                }
            }, this.options);

            this.observer.observe(this.$el);
        },
        destroyed() {
            this.unobserve();
        },
        methods: {
            unobserve() {
                this.observer.unobserve(this.$el);
            },
        },
    };
</script>