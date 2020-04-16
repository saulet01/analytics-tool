<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-items>
                    <div class="d-flex fkex-column">
                        <a
                            :href="output"
                            class="mt-5"
                            download
                            style="color: #fff; text-decoration: none;"
                        >
                            Download
                            <v-icon small>fas fa-download</v-icon>
                        </a>
                    </div>
                    <v-spacer></v-spacer>
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

<style></style>
