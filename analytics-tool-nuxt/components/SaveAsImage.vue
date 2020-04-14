<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>Download Image by "Right Click"</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark text @click="closeDialog()">
                        Close
                        <v-icon class="ml-2" small>fas fa-times</v-icon>
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>

            <img :src="output" style="max-width: 100%" alt />
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ["dialog", "output"],
        methods: {
            closeDialog() {
                let newDialogValue = false;
                this.$emit("close-dialog", newDialogValue);
            }
        }
    };
</script>

<style>
</style>