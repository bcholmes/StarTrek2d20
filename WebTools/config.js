System.config({
    baseURL: "/",
    defaultJSExtensions: true,
    transpiler: false,
    paths: {
        "npm:*": "./node_modules/*"
    },

    map: {
        "react": "npm:react/dist/react",
        "fbjs": "npm:fbjs",
        "react-dom": "npm:react-dom/dist/react-dom",
        "es6-promise": "npm:es6-promise/dist/es6-promise.min"
    }
});