<template>
    <v-card>
        <v-toolbar color="primary">
            <v-btn text dark @click="closeModal">
                Close
                <v-icon class="ml-2" small>fas fa-times</v-icon>
            </v-btn>
        </v-toolbar>
        <v-card-title class="neutral-color">Couldn't load: {{ loadErrors.length }} item(s)</v-card-title>
        <v-card-text>
            <v-simple-table dense fixed-header class="elevation-2">
                <template v-slot:default>
                    <thead>
                        <tr>
                            <th
                                style="background-color: #fe7d3b; color: #fff;"
                                class="text-center font-weight-bold"
                            >#</th>
                            <th
                                style="background-color: #fe7d3b; color: #fff;"
                                class="text-center font-weight-bold"
                            >title</th>
                            <th
                                style="background-color: #fe7d3b; color: #fff;"
                                class="text-center font-weight-bold"
                            >date</th>
                            <th
                                style="background-color: #fe7d3b; color: #fff;"
                                class="text-center font-weight-bold"
                            >description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in loadErrors" :key="'error'+index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.title }}</td>
                            <td>{{ item.date }}</td>
                            <td>{{ item.description }}</td>
                        </tr>
                    </tbody>
                </template>
            </v-simple-table>
        </v-card-text>
    </v-card>
</template>

<script>
    export default {
        props: ["loadErrors", "errorDetails"],
        methods: {
            closeModal() {
                let modalValue = false;
                this.$emit("detailedError", modalValue);
            }
        }
    };
</script>

<style>
</style>