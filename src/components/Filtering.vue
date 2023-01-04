<template>
    <div>
        <h5>Filter by:</h5>

        <b-form-group :label="`Recipe's type`">
            <b-form-checkbox-group
                v-model="filterOptions.types"
                :options="typeOptions"
                value-field="value"
                text-field="text"
                switches
            />
        </b-form-group>

        <b-form-group :label="`Recipe's difficulty`">
            <b-form-checkbox-group
                v-model="filterOptions.difficulties"
                :options="difficultyOptions"
                value-field="value"
                text-field="text"
                switches
            />
        </b-form-group>

        <b-form-group label="Count of people to serve">
            <b-form-spinbutton
                v-model="filterOptions.forServing"
                wrap min="0"
                max="15"
                step="1"
            />
        </b-form-group>

        <b-form-group :label="`Recipe's rating`">
            <b-input-group>
                <template #prepend>
                    <b-input-group-text
                        class="justify-content-center font-weight-bold"
                    >
                        {{ filterOptions.rating }}
                    </b-input-group-text>
                </template>

                <b-form-rating
                    v-model="filterOptions.rating"
                    precision="1"
                    color="#ff8800"
                    inline
                />

                <template #append>
                    <b-input-group-text
                        class="justify-content-center"
                        @click="filterOptions.rating = 0"
                    >
                        <i class="las la-times"></i>
                    </b-input-group-text>
                </template>
            </b-input-group>
        </b-form-group>

        <b-button
            variant="danger"
            size="sm"
            class="mt-2"
            @click="resetOptions"
        >
            Reset
        </b-button>
    </div>
</template>

<script>
    import { mapActions } from 'vuex';
    import { mapGetters } from 'vuex';

    export default {
        data() {
            return {
                filterOptions: {
                    types: [],
                    difficulties: [],
                    forServing: 0,
                    rating: 0,
                },
            };
        },
        watch: {
            filterOptions: {
                deep: true,
                handler(options) {
                    this.setFilterOptions(options);
                    sessionStorage.setItem('active-filters', JSON.stringify(options));
                },
            },
        },
        computed: {
            ...mapGetters({
                translations: 'getTranslations',
            }),
            typeOptions() {
                const includableKeys = ['breakfast', 'lunch', 'dinner'];
                return Object.keys(this.translations).filter(key => includableKeys.includes(key)).map(key => ({value: key, text: this.translations[key]}));
            },
            difficultyOptions() {
                const includableKeys = ['beginner', 'moderate', 'difficult'];
                return Object.keys(this.translations).filter(key => includableKeys.includes(key)).map(key => ({value: key, text: this.translations[key]}));
            },
        },
        mounted() {
            const selectedOptions = sessionStorage.getItem('active-filters');

            if (selectedOptions) {
                this.filterOptions = JSON.parse(selectedOptions);
            }
        },
        methods: {
            ...mapActions([
                'setFilterOptions',
            ]),
            resetOptions() {
                this.filterOptions = {
                    types: [],
                    difficulties: [],
                    forServing: 0,
                    rating: 0,
                };
            },
        },
    };
</script>