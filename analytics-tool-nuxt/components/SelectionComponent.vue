<template>
    <v-card class="mx-auto mt-6" elevation="2" height="590">
        <v-card-title class="flex-column d-flex align-baseline neutral-color">
            {{getName}}
            <div class="d-flex mt-n2 flex-row align-center justify-space-between">
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line></v-text-field>
                <v-btn
                    class="ml-4"
                    small
                    fab
                    color="primary"
                    v-show="selectedemail.length > 0"
                    @click.stop="dialog = true"
                >
                    <v-icon small>fas fa-expand-arrows-alt</v-icon>
                </v-btn>
            </div>
        </v-card-title>
        <v-card-text>
            <v-data-table
                :headers="headers"
                :items="selectedemail"
                :search="search"
                dense
                height="420"
                class="mt-n5 data-table"
                @change="goTo"
                :fixed-header="fixedHeader"
            >
                <template v-slot:item.state="{ item }">
                    <v-chip class="mr-n1" :color="getColor(item.state)" small dark>{{ item.state }}</v-chip>
                </template>
                <template v-slot:item.to="{ item }" v-slot:activator>
                    <v-list-item
                        v-for="(email, index) in item.to"
                        :key="index"
                        :class="index == 0? 'mt-n4' : 'mt-n6'"
                    >
                        <v-list-item-content>
                            <v-list-item-subtitle style="font-size: 0.8em;" class="pa-0">{{ email }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </template>
                <template v-slot:item.from="{ item }">
                    <div style="width: 8em;">
                        <p style="font-size: 0.8em;">{{ item.from }}</p>
                    </div>
                </template>
                <template v-slot:item.date="{ item }">
                    <p style="font-size: 0.8em;">{{ item.date }}</p>
                </template>
                <template v-slot:item.message="{ item }">
                    <p style="font-size: 0.8em;">{{ item.message }}</p>
                </template>
            </v-data-table>
        </v-card-text>
        <v-dialog v-model="dialog" width="100%">
            <v-card>
                <v-card-title>
                    {{getName}}
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Search"
                        single-line
                    ></v-text-field>
                </v-card-title>
                <v-card-text class="mt-n3">
                    <v-data-table
                        :headers="headers"
                        :items="selectedemail"
                        :search="search"
                        dense
                        height="450"
                        calculate-widths
                        :fixed-header="fixedHeader"
                    >
                        <template v-slot:item.state="{ item }">
                            <v-chip :color="getColor(item.state)" small dark>{{ item.state }}</v-chip>
                        </template>
                        <template v-slot:item.to="{ item }" v-slot:activator>
                            <div style="width: 60em;">
                                <v-text
                                    v-for="(email, index) in item.to"
                                    :key="index"
                                    style="font-size: 0.8em;"
                                >{{ email | displayTo(index, item.to) }}</v-text>
                            </div>
                        </template>
                        <template v-slot:item.from="{ item }">
                            <div style="width: 8em;">
                                <v-text style="font-size: 0.8em;">{{ item.from }}</v-text>
                            </div>
                        </template>
                        <template v-slot:item.date="{ item }">
                            <v-text style="font-size: 0.8em;">{{ item.date }}</v-text>
                        </template>
                        <template v-slot:item.message="{ item }">
                            <v-text style="font-size: 0.8em;">{{ item.message }}</v-text>
                        </template>
                    </v-data-table>
                </v-card-text>

                <v-card-actions class="mt-n10">
                    <v-btn color="red" dark @click="dialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
    export default {
        props: {
            selectedemail: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                headers: [],
                search: "",
                active: true,
                dialog: false,
                selectedName: "",
                fixedHeader: true
            };
        },

        filters: {
            displayTo(newValue, index, arrayTo) {
                return index == arrayTo.length - 1 ? newValue : newValue + ", ";
            }
        },

        computed: {
            getName() {
                return this.selectedName ? this.selectedName : "Selection: ";
            }
        },

        methods: {
            getColor(item) {
                if (item === "Received") {
                    return "red";
                } else {
                    return "green";
                }
            },
            goTo() {
                this.$vuetify.goTo(".data-table tbody tr", {
                    offset: 50,
                    container: ".v-data-table__wrapper"
                });
            }
        },
        watch: {
            selectedemail() {
                this.$vuetify.goTo(".data-table tbody tr", {
                    offset: 50,
                    container: ".v-data-table__wrapper"
                });
                var nodes = Object.keys(this.selectedemail[0]);
                this.selectedName = this.selectedemail[0].from;
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
/* td {
    width: 30px;
} */
</style>
