<template>
    <v-row>
        <v-col>
            <v-card>
                <v-card-title>
                    Email Data:
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                        hide-details
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    :search="search"
                    :headers="headers"
                    :items="originaldata"
                    class="elevation-1"
                ></v-data-table>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
    export default {
        props: {
            originaldata: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                search: "",
                headers: []
            };
        },
        watch: {
            originaldata() {
                var nodes = Object.keys(this.originaldata[0]);
                var links = nodes.map(function(d) {
                    return {
                        text: d,
                        value: d
                    };
                });
                this.headers = links;
            }
        }
    };
</script>

<style>
</style>