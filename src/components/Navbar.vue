<template>
    <b-navbar
        :sticky="sticky"
        :toggleable="toggleable"
        :type="type"
        :variant="variant"
    >
        <b-navbar-brand href="#" @click.prevent="navigateToHome">
            {{ siteTitle }}
        </b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav v-if="navItems.length">
                <b-nav-item
                    v-for="(item, idx) in navItems"
                    :key="idx"
                    :to="item.path"
                >
                    {{ item.name }}
                </b-nav-item>
            </b-navbar-nav>

            <b-navbar-nav class="ml-auto">
                <b-button
                    v-if="$route.name === 'Collection'"
                    variant="success"
                    size="sm"
                    pill
                    class="my-2 mr-3"
                    :disabled="!filterSortAllowed"
                    @click="$emit('sort-or-filter')"
                >
                    Sort/filter
                </b-button>

                <b-nav-form>
                    <Search
                        :search="search"
                        :search-allowed="searchAllowed"
                        class="mr-3"
                        @searched="(query) => $emit('searched', query)"
                    />
                </b-nav-form>

                <b-button
                    v-if="$route.name === 'Collection'"
                    variant="success"
                    class="my-2"
                    @click="$emit('add-modal-open')"
                >
                    Add recipe
                </b-button>
            </b-navbar-nav>
        </b-collapse>
    </b-navbar>
</template>

<script>
    import Search from '@/components/common/Search';

    export default {
        components: {
            Search,
        },
        props: {
            sticky: {
                type: Boolean,
                default: true,
            },
            toggleable: {
                type: [Boolean, String],
                default: 'lg',
            },
            type: {
                type: String,
                default: 'dark',
            },
            variant: {
                type: String,
                default: 'primary',
            },
            siteTitle: {
                type: String,
                default: 'Recipe Box',
            },
            navItems: {
                type: Array,
                default: () => ([
                    {
                        name: 'Collection',
                        path: '/',
                    },
                    {
                        name: 'External',
                        path: '/external-search',
                    },
                ]),
            },
            search: {
                type: String,
                default: '',
            },
            searchAllowed: {
                type: Boolean,
                default: true,
            },
            filterSortAllowed: {
                type: Boolean,
                default: true,
            },
        },
        methods: {
            navigateToHome() {
                if (this.$route.name === 'Collection') {
                    return;
                }

                this.$router.push('/');
            },
        },
    };
</script>