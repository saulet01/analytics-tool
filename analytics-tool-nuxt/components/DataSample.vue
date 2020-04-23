<template>
    <v-card flat>
        <v-card-title class="neutral-color">Data Format</v-card-title>
        <v-card-text class="d-flex flex-row justify-space-between">
            <div>
                <p class="title primary-color">.json</p>
                <pre class="d-flex justify-space-between">
                                    <code style="background-color: #fff;">
            [
                {
                    "title": "Sample Title",
                    "description": "Sample Description",
                    "date": "01/01/2017 00:00:00"
                },
                {
                    ...
                }
            ]
                                    </code>
                                </pre>
            </div>
            <div>
                <p class="title primary-color">.csv</p>
                <v-simple-table dense>
                    <template v-slot:default>
                        <thead>
                            <tr>
                                <th class="text-left">title</th>
                                <th class="text-left">description</th>
                                <th class="text-left">date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sample Title</td>
                                <td>Sample Description</td>
                                <td>01/01/2017 00:00:00</td>
                            </tr>
                            <tr>
                                <td>...</td>
                                <td>...</td>
                                <td>...</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-btn color="neutral" @click="closeModal" dark>Close</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ["modalData"],
        methods: {
            closeModal() {
                let modalState = false;
                this.$emit("returnValue", modalState);
            }
        }
    };
</script>

<style>
</style>