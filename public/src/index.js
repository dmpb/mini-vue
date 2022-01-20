import MiniVue from "@dmpb017/mini-vue"
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
