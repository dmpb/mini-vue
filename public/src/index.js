/*import MiniVue from "./scripts/MiniVue"
import javascriptLogo from "./../src/assets/images/javascript-logo.jpeg"
import "./styles/main.css"*/

/*import MiniVue from "./../src/index.js"

const app = new MiniVue({
    data() {
        return {
            message: "Hello world",
            url: javascriptLogo,
        }
    },
})

app.mount()
*/
import MiniVue from "./../../src/index"

const app = new MiniVue({
    data() {
        return {
            message: "Hello world",
            url: "asdf",
        }
    },
})

app.mount()
