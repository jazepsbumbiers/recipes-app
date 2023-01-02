<template>
    <div>
        <Header
            :search-allowed="searchAllowed"
            :filter-sort-allowed="filterSortAllowed"
            @item-added="$refs.router.$refs.list.fetchData()"
            @sort-or-filter="sidebar = !sidebar"
        />

        <Sidebar
            :visible="sidebar"
            title="Sort / Filter"
            id="sort-or-filter-sidebar"
            @sidebar-closed="sidebar = false"
        >
            <Sort />

            <Filtering class="mt-3" />
        </Sidebar>

        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__fadeInDown"
            leave-active-class="animate__animated animate__fadeOutDown"
        >
            <router-view
                ref="router"
                @items-loaded="(items) => this.setSearchAndFilterAbility(items)"
            />
        </transition>
    </div>
</template>

<script>
    import Header from '@/components/Header';
    import Sidebar from '@/components/common/Sidebar';
    import Sort from '@/components/Sort';
    import Filtering from '@/components/Filtering';
    import { mapActions } from 'vuex';

    export default {
        components: {
            Header,
            Sidebar,
            Sort,
            Filtering,
        },
        data() {
            return {
                searchAllowed: false,
                filterSortAllowed: false,
                sidebar: false,
            };
        },
        watch: {
            $route() {
                // this.search = '';
            },
        },
        mounted() {
            this.setSearchTerm(sessionStorage.getItem('active-search-term') || '');
            this.setSidebarVisibility();
        },
        methods: {
            ...mapActions([
                'setSearchTerm',
            ]),
            setSearchAndFilterAbility(items) {
                this.searchAllowed = items.length ? true : false;
                this.filterSortAllowed = items.length ? true : false;
            },
            setSidebarVisibility() {
                const { sortBy, order } = JSON.parse(sessionStorage.getItem('active-sort-options') || "{}");
                const filterOptions = JSON.parse(sessionStorage.getItem('active-filters') || "{}");
                const hasFilters = Object.values(filterOptions).filter(i => Array.isArray(i) ? i.length : i).length;

                if (sortBy && order || hasFilters) {
                    this.sidebar = true;
                }
            }
        },
    };
</script>
