module.exports = {
    content: [
        // '!./src/views/index.ejs',
        // './src/views/**/*.ejs'
        // have to do each views directory since glob expressions dont work so well with webpack iic
        // TODO: fix above
        './src/views/layouts/index.src.ejs',
        './src/views/partials/**/*.ejs',
        './src/views/admin/**/*.ejs',
        './src/views/index/**/*.ejs',
        './src/views/seasons/**/*.ejs',
    ],
    theme: {
        extend: {
            colors: {
                darkPurple: {
                    '800': '#270f37',
                    '900': '#12061b'//'#200a31'
                }
            },
        },
    },
    plugins: [],
};