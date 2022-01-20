# MiniVue
MiniVue es una pequeña librería sobre como funciona Vuejs.

## 🏁 Instalación
```shell
npm i @dmpb017/mini-vue
```
## 🏗 Uso
```javascript
import MiniVue from "@dmpb017/mini-vue"

const app = new MiniVue({
    data() {
        return {
            message: "Hello world",
            url: "https://images.com/javascript.png",
        }
    },
})

app.mount()
```

### v-text
```html
<p v-text="message"></p>
```
### v-model
```html
<input type="text" v-model="message">
```
### v-bind
```html
<img v-bind:src="url" v-bind:alt="message">
```
