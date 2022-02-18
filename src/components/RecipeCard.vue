<template>
    <div>
        <b-card
            :title="recipe.name"
            :img-src="recipe.image || require('../assets/no-img.webp')"
            :img-alt="recipe.name"
            img-top
            :img-height="imgHeight"
            :img-width="imgWidth"
            :bg-variant="bgVariant"
            :tag="tag"
            class="mr-3 mt-5"
        >
            <b-card-text>
                <div class="mb-2">
                    <DifficultyBadge :difficulty="recipe.difficultyLevel" />
                </div>

                <div>
                    <span class="font-weight-bold">Ingredients:</span>
                    {{ recipeIngredients }}
                </div>

                <div>
                    <b-form-rating
                        :value="recipe.rating"
                        readonly
                        inline
                        size="lg"
                        no-border
                        color="#ff8800"
                        class="p-0 mt-2"
                        style="background-color: #f8f9fa;"
                    />
                </div>
            </b-card-text>

            <b-button
                variant="primary"
                size="sm"
                class="d-block"
                v-b-modal="`show-recipe-${recipe.id}-modal`"
            >
                {{ external ? 'Show recipe' : 'Show/edit recipe' }}
            </b-button>

            <b-button
                v-if="!external"
                variant="danger"
                size="sm"
                class="d-block mt-2"
                @click="deleteRecipe(recipe.id)"
            >
                Delete recipe
            </b-button>

            <b-card-text class="mt-3">
                <small class="text-muted d-block">Date added: {{ dateAdded(recipe) }}</small>
                <small class="text-muted d-block">Date updated: {{ dateUpdated(recipe) }}</small>
            </b-card-text>
        </b-card>

        <b-modal
            :id="`show-recipe-${recipe.id}-modal`"
            :title="recipe.name"
            centered
            @ok.prevent="$refs.editForm.submit()"
        >
            <template #modal-footer="{ ok, cancel }">
                <b-button size="md" variant="danger" :disabled="!resetAllowed" @click="$refs.editForm.resetForm(recipe.id)">
                    Clear
                </b-button>

                <b-button size="md" variant="secondary" class="ml-auto" @click="cancel()">
                    Cancel
                </b-button>

                <b-button size="md" variant="success" :disabled="!submitAllowed" @click="ok()">
                    {{ external ? 'Save to collection' : 'Update' }}
                </b-button>
            </template>

            <Form
                :id="recipe.id"
                ref="editForm"
                :data="external ? { ...recipe } : null"
                @submit-allowed="v => submitAllowed = v"
                @reset-allowed="v => resetAllowed = v"
                @item-updated="(item) => itemUpdated(item)"
            />
        </b-modal>
    </div>
</template>

<script>
    import DifficultyBadge from '@/components/parts/DifficultyBadge';
    import Form from '@/components/Form';
    import moment from 'moment';
    import axios from "axios";

    export default {
        components: {
            DifficultyBadge,
            Form,
        },
        props: {
            recipe: {
                type: Object,
                default: () => ({}),
            },
            imgHeight: {
                type: Number,
                default: 250,
            },
            imgWidth: {
                type: Number,
                default: 250,
            },
            bgVariant: {
                type: String,
                default: 'light',
            },
            tag: {
                type: String,
                default: 'article',
            },
            external: {
                type: Boolean,
                default: false,
            },
            showIngredients: {
                type: Number,
                default: 5,
            },
        },
        data() {
            return {
                submitAllowed: false,
                resetAllowed: false,
            };
        },
        computed: {
            recipeIngredients() {
                const ingredients = this.recipe.ingredients.slice(0, this.showIngredients).join(', ');
                const ellipsis = this.recipe.ingredients.length > this.showIngredients ? ', ...' : '';

                return `${ingredients}${ellipsis}`;
            },
        },
        methods: {
            dateAdded(recipe) {
                return moment(recipe.added).format('DD.MM.YYYY HH:mm');
            },
            dateUpdated(recipe) {
                if (!recipe.updated) {
                    return '-';
                }

                return moment(recipe.updated).format('DD.MM.YYYY HH:mm');
            },
            itemUpdated(item) {
                this.$bvModal.hide(`show-recipe-${item.id}-modal`);

                this.$bvToast.toast(
                    this.external ? 'Recipe saved to collection successfully' : 'Recipe updated successfully',
                    {
                        title: this.external ? 'Item saved' : 'Item updated',
                        variant: 'success',
                        toaster: 'b-toaster-bottom-right',
                        toastClass: 'mb-2 mr-2',
                        solid: true,
                    }
                );

                this.$emit('item-updated');
            },
            async deleteRecipe(id) {
                const response = await this.$bvModal.msgBoxConfirm(`Do you really want to delete this recipe? This cannot be undone!`, {
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

                await axios.delete(`http://localhost:3000/recipes/${id}`);

                this.$bvToast.toast('Recipe deleted successfully', {
                    title: 'Item deleted',
                    variant: 'success',
                    toaster: 'b-toaster-bottom-right',
                    toastClass: 'mb-2 mr-2',
                    solid: true,
                });

                this.$emit('item-deleted');
            },
        },
    };
</script>