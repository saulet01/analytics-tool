<template>
    <v-card flat>
        <v-card-title class="neutral-color display-1 d-flex justify-center">Data Format</v-card-title>
        <v-card-subtitle class="mt-2">
            <v-expansion-panels>
                <v-expansion-panel>
                    <v-expansion-panel-header
                        class="primary-color font-weight-bold"
                    >Allowed Date Formats:</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <div style="column-count: 4;">
                            <ul v-for="(item, index) in dateFormat" :key="'dateFormat'+index">
                                <li>{{ item }}</li>
                            </ul>
                        </div>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card-subtitle>
        <v-card-text class="d-flex flex-row justify-space-between mt-2">
            <div>
                <p class="title primary-color">.json</p>
                <pre class="d-flex justify-space-between">
                                <code style="background-color: #fff;">
        [
            {
                "title": "My Sample Title",
                "description": "My Sample Description",
                "date": "01/01/2020 00:00:00"
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
                                <td>My Sample Title</td>
                                <td>My Sample Description</td>
                                <td>01/01/2020 00:00:00</td>
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
            <div>
                <p class="title primary-color">.txt</p>
                <p>My Sample Source</p>
                <p>My Sample Title</p>
                <p>01/01/2020 00:00:00</p>
                <p>My Sample Description</p>
            </div>
        </v-card-text>

        <v-card-actions>
            <v-btn color="neutral" @click="closeModal" dark>Close</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
    export default {
        props: ["modalData", "dateFormat"],
        methods: {
            closeModal() {
                let modalState = false;
                this.$emit("returnValue", modalState);
            }
        }
    };
</script>

<style scoped>
</style>