<template>
    <div>
        <Navbar
            v-bind="{...$props}"
            @sort-or-filter="$emit('sort-or-filter')"
            @searched="(query) => $emit('searched', query)"
            @add-modal-open="addModal = true"
        />

        <b-modal
            v-model="addModal"
            title="Add new recipe"
            centered
            @ok.prevent="$refs.addForm.submit()"
        >
            <template #modal-footer="{ ok, cancel }">
                <b-button size="md" variant="danger" :disabled="!resetAllowed" @click="$refs.addForm.resetForm()">
                    Reset
                </b-button>

                <b-button size="md" variant="secondary" class="ml-auto" @click="cancel()">
                    Cancel
                </b-button>

                <b-button size="md" variant="success" :disabled="!submitAllowed" @click="ok()">
                    Add
                </b-button>
            </template>

            <Form
                ref="addForm"
                @submit-allowed="v => submitAllowed = v"
                @reset-allowed="v => resetAllowed = v"
                @item-added="itemAdded"
            />
        </b-modal>
    </div>
</template>

<script>
    import Form from '@/components/Form';
    import Navbar from '@/components/Navbar';

    export default {
        components: {
            Form,
            Navbar,
        },
        props: {
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
        data() {
            return {
                addModal: false,
                submitAllowed: false,
                resetAllowed: false,
            };
        },
        methods: {
            itemAdded() {
                this.addModal = false;

                this.$bvToast.toast('Recipe added successfully', {
                    title: 'Item added',
                    variant: 'success',
                    toaster: 'b-toaster-bottom-right',
                    toastClass: 'mb-2 mr-2',
                    solid: true,
                });

                this.$emit('item-added');
            },
        },
    };
</script>