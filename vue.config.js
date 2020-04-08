module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    devServer: {
        proxy: "https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/31d4411e-361b-4e75-8810-94c3bf318611",
    }

}