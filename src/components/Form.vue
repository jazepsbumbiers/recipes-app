<template>
    <b-overlay
        :show="loading"
        rounded="sm"
        spinner-variant="primary"
    >
        <b-img
            :src="item.image || require('../assets/no-img.webp')"
            :alt="item.name"
            :width="250"
            :height="250"
            :rounded="item.image ? 'circle' : '0'"
            center
        />

        <b-form-group
            :label="`Recipe's name *`"
            :invalid-feedback="errors.name || ''"
        >
            <b-form-input
                type="text"
                v-model.trim="item.name"
                placeholder="Enter desired name for recipe"
                :state="errors.name ? false : null"
            />
        </b-form-group>

        <b-form-group :label="`Recipe's type`">
            <b-form-checkbox
                v-for="(type, idx) in types"
                :key="idx"
                v-model="item.type"
                :value="type"
                unchecked-value=""
                inline
                switch
            >
                {{ type.charAt(0).toUpperCase() + type.slice(1) }}
            </b-form-checkbox>
        </b-form-group>

        <b-form-group
            label="Count of people to serve"
            :invalid-feedback="errors.forServing || ''"
        >
            <b-form-input
                type="number"
                min="1"
                max="15"
                v-model.number.trim="item.forServing"
                placeholder="Enter count of people to serve"
                :state="errors.forServing ? false : null"
                @keypress="isNumber"
            />
        </b-form-group>

        <b-form-group label="Difficulty level">
            <b-form-checkbox
                v-for="(difficulty, idx) in difficulties"
                :key="idx"
                v-model="item.difficultyLevel"
                :value="difficulty"
                unchecked-value=""
                inline
                switch
            >
                {{ difficulty.charAt(0).toUpperCase() + difficulty.slice(1) }}
            </b-form-checkbox>
        </b-form-group>

        <b-form-group
            label="Ingredients *"
            :invalid-feedback="errors.ingredients || ''"
            :state="errors.steps ? false : null"
        >
            <b-button
                variant="success"
                size="sm"
                :disabled="item.ingredients.length >= 15"
                @click="addItem('ingredient')"
            >
                Add ingredient
            </b-button>

            <b-input-group
                v-for="(ingredient, idx) in item.ingredients"
                :key="idx"
                class="mt-3"
            >
                <template #prepend>
                    <b-input-group-text>
                        {{ (1 + idx) }}.
                    </b-input-group-text>
                </template>

                <template #append>
                    <b-input-group-text
                        style="cursor: pointer;"
                        @click="deleteItem('ingredient', idx)"
                    >
                        <i class="las la-trash-restore"></i>
                    </b-input-group-text>
                </template>

                <b-form-input
                    type="text"
                    v-model.trim="item.ingredients[idx]"
                    ref="ingredient"
                    placeholder="Enter desired ingredient"
                    :state="errors.ingredients ? false : null"
                />
            </b-input-group>
        </b-form-group>

        <b-form-group
            label="Steps *"
            :invalid-feedback="errors.steps || ''"
            :state="errors.steps ? false : null"
        >
            <b-button
                variant="success"
                size="sm"
                :disabled="item.steps.length >= 15"
                @click="addItem('step')"
            >
                Add step
            </b-button>

            <b-input-group
                v-for="(step, idx) in item.steps"
                :key="idx"
                class="mt-3"
            >
                <template #prepend>
                    <b-input-group-text>
                        {{ (1 + idx) }}.
                    </b-input-group-text>
                </template>

                <template #append>
                    <b-input-group-text
                        style="cursor: pointer;"
                        @click="deleteItem('step', idx)"
                    >
                        <i class="las la-trash-restore"></i>
                    </b-input-group-text>
                </template>

                <b-form-textarea
                    v-model.trim="item.steps[idx]"
                    ref="step"
                    rows="2"
                    placeholder="Enter desired step"
                    :state="errors.steps ? false : null"
                />
            </b-input-group>
        </b-form-group>

        <b-form-group :label="`Recipe's source`">
            <b-form-input
                type="text"
                v-model.trim="item.source"
                :placeholder="`Enter recipe's source`"
            />
        </b-form-group>

        <b-form-group :label="`Recipe's image`">
            <b-form-input
                type="text"
                v-model.trim="item.image"
                :placeholder="`Enter recipe's image source`"
            />
        </b-form-group>

        <b-form-group :label="`Recipe's rating`">
            <b-input-group>
                <template #prepend>
                    <b-input-group-text class="justify-content-center font-weight-bold">
                        {{ item.rating || '-' }}
                    </b-input-group-text>
                </template>

                <b-form-rating
                    v-model="item.rating"
                    precision="1"
                    size="lg"
                    color="#ff8800"
                    inline
                />

                <template #append>
                    <b-input-group-text
                        class="justify-content-center"
                        @click="item.rating = 0"
                    >
                        <i class="las la-trash-restore"></i>
                    </b-input-group-text>
                </template>
            </b-input-group>
        </b-form-group>
    </b-overlay>
</template>

<script>
    import { localAPI } from '../services/api';

    export default {
        props: {
            id: {
                type: Number,
                default: null,
            },
            data: {
                type: [Object, null],
                default: null,
            },
        },
        data() {
            return {
                item: {
                    name: '',
                    type: '',
                    forServing: null,
                    difficultyLevel: '',
                    ingredients: [''],
                    steps: [''],
                    source: '',
                    image: '',
                    rating: 0,
                },
                requiredFields: ['name', 'ingredients', 'steps'],
                types: ['breakfast', 'lunch', 'dinner'],
                difficulties: ['beginner', 'moderate', 'difficult'],
                loading: false,
                errors: {},
            };
        },
        computed: {
            submitAllowed() {
                const requiredFields = this.requiredFields;
                const requiredFieldValues = Object.keys(this.item).filter(key => requiredFields.includes(key)).map(key => this.item[key]);

                const submitAllowed = requiredFieldValues.filter(value => Array.isArray(value) ? value.filter(v => v).length : value).length === requiredFields.length;

                return submitAllowed;
            },
            resetAllowed() {
                const fieldValues = Object.values(this.item).filter(value => Array.isArray(value) ? value.filter(v => v).length : value);
                return Boolean(fieldValues.length);
            },
        },
        watch: {
            submitAllowed(value) {
                this.$emit('submit-allowed', value);
            },
            resetAllowed(value) {
                this.$emit('reset-allowed', value);
            },
        },
        created() {
            if (this.id) {
                this.loadItem();
            }
        },
        methods: {
            isNumber(event) {
                const keysAllowed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                const keyPressed = event.key;

                if (!keysAllowed.includes(keyPressed)) {
                    event.preventDefault();
                }
            },
            addItem(type) {
                if (typeof type !== 'string' || !type) {
                    return;
                }

                let collection = [];

                switch (type) {
                    case 'ingredient':
                        collection = this.item.ingredients;
                        break;
                    case 'step':
                        collection = this.item.steps;
                        break;
                    default:
                        return;
                }

                if (collection.length >= 15) {
                    return;
                }

                collection.push('');

                this.focusLastElement(type, collection);
            },
            focusLastElement(type, collection) {
                this.$nextTick(() => {
                    let refs;

                    switch (type) {
                        case 'ingredient':
                            refs = this.$refs.ingredient;
                            break;
                        case 'step':
                            refs = this.$refs.step;
                            break;
                        default:
                            return;
                    }

                    refs[collection.length - 1].$el.focus();
                });
            },
            deleteItem(type, idx) {
                if (typeof type !== 'string' || !type || !Number.isInteger(idx)) {
                    return;
                }

                let collection = [];

                switch (type) {
                    case 'ingredient':
                        collection = this.item.ingredients;
                        break;
                    case 'step':
                        collection = this.item.steps;
                        break;
                    default:
                        return;
                }

                if (collection.length === 1) {
                    return;
                }

                collection.splice(idx, 1);
            },
            async submit() {
                if (this.loading) {
                    return;
                }

                this.loading = true;

                const item = {
                    ...this.item,
                    name: this.item.name.charAt(0).toUpperCase() + this.item.name.slice(1),
                    forServing: this.item.forServing === '' ? null : this.item.forServing,
                    ingredients: this.item.ingredients.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
                    steps: this.item.steps.map(i => i.charAt(0).toUpperCase() + i.slice(1)),
                };

                if (!this.validateFormFields(item)) {
                    this.loading = false;

                    return;
                }

                let response;

                if (this.id) {
                    if (this.data) {
                        delete item['id'];

                        response = await localAPI.post(
                            '/recipes',
                            {...item, added: + new Date()}
                        );
                    } else {
                        response = await localAPI.put(
                            `/recipes/${this.id}`,
                            {...item, updated: + new Date()}
                        );
                    }

                    this.$emit('item-updated', {
                        ...response.data,
                        id: this.id,
                    });
                } else {
                    response = await localAPI.post(
                        '/recipes',
                        {...item, added: + new Date()}
                    );

                    this.$emit('item-added');
                }

                this.loading = false;
            },
            validateFormFields(data) {
                this.errors = {};

                Object.entries(data).forEach(([key, value]) => {
                    switch (key) {
                        case 'name':
                            if (!value) {
                                this.errors[key] = 'Recipe name is required';
                            }
                            break;
                        case 'forServing':
                            if (value === 0 || value >= 15) {
                                this.errors[key] = 'Count of people purposed to serve must be between 1-15';
                            }
                            break;
                        case 'ingredients':
                        case 'steps':
                            if (value.filter(i => i).length !== value.length) {
                                let item = key === 'ingredients' ? 'ingredient' : 'step';

                                this.errors[key] = `There must be atleast one ${item} added and no empty fields are allowed`;
                            }
                            break;
                        default:
                            break;
                    }
                });

                return Object.entries(this.errors).length
                    ? false
                    : true;
            },
            async resetForm(id = null) {
                if (!this.resetAllowed) {
                    return;
                }

                if (id) {
                    const response = await this.$bvModal.msgBoxConfirm(`Do you really want to clear every form field? This cannot be undone!`, {
                        title: 'Please confirm',
                        size: 'sm',
                        buttonSize: 'sm',
                        okVariant: 'danger',
                        okTitle: 'Yes',
                        cancelTitle: 'No',
                        footerClass: 'p-2',
                        hideHeaderClose: false,
                        centered: true,
                    });

                    if (!response) {
                        return;
                    }
                }

                this.item = {
                    name: '',
                    type: '',
                    forServing: null,
                    difficultyLevel: '',
                    ingredients: [''],
                    steps: [''],
                    source: '',
                    image: '',
                    rating: 0,
                };
            },
            async loadItem() {
                this.loading = true;

                if (this.data) {
                    this.item = this.data;
                } else {
                    const response = await localAPI.get(`/recipes/${this.id}`);
                    this.item = response.data;
                }

                this.loading = false;
            },
        },
    };
</script>