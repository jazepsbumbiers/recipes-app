<template>
    <div id="app">
        <Header
            :search="search"
            :search-allowed="searchAllowed"
            :filter-sort-allowed="filterSortAllowed"
            @item-added="$refs.router.$refs.list.fetchData()"
            @searched="(query) => search = query"
            @sort-or-filter="sidebar = true"
        />

        <Sidebar
            :visible="sidebar"
            title="Sort / Filter"
            id="sort-or-filter-sidebar"
            @sidebar-closed="sidebar = false"
        >
            <Sort
                @sorting-active="(options) => sortOptions = options"
            />

            <Filtering
                class="mt-3"
                @filtering-active="(options) => filterOptions = options"
            />
        </Sidebar>

        <transition
            mode="out-in"
            enter-active-class="animate__animated animate__fadeInDown"
            leave-active-class="animate__animated animate__fadeOutDown"
        >
            <router-view
                ref="router"
                :search="search"
                :sort-options="sortOptions"
                :filter-options="filterOptions"
                @items-loaded="(items) => this.setSearchAndFilterAbility(items)"
                @item-saved-to-collection="itemSavedToCollection"
            />
        </transition>
    </div>
</template>

<script>
    import Header from '@/components/Header';
    import Sidebar from '@/components/common/Sidebar';
    import Sort from '@/components/Sort';
    import Filtering from '@/components/Filtering';

    export default {
        components: {
            Header,
            Sidebar,
            Sort,
            Filtering,
        },
        data() {
            return {
                search: '',
                searchAllowed: false,
                filterSortAllowed: false,
                sidebar: false,
                sortOptions: {},
                filterOptions: {},
            };
        },
        watch: {
            $route() {
                this.search = '';
            },
        },
        methods: {
            setSearchAndFilterAbility(items) {
                this.searchAllowed = items.length ? true : false;
                this.filterSortAllowed = items.length ? true : false;
            },
            itemSavedToCollection() {
                this.search = '';
                this.$router.push('/');
            },
        },
    };
</script>
