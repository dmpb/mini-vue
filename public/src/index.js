import MiniVue from "./../../src/index"
import javascriptLogo from "./../src/assets/images/javascript-logo.jpeg"
import "./styles/main.css"

const app = new MiniVue({
    data() {
        return {
            message: "Hello world",
            url: javascriptLogo,
        }
    },
})

app.mount()
