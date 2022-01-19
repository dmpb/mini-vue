class MiniVue {
    deps = new Map()

    constructor(options) {
        this.origen = options.data()
        const self = this

        // Destino
        this.$data = new Proxy(this.origen, {
            get(target, name) {
                if (name in target) {
                    self.track(target, name)
                    return Reflect.get(target, name)
                }
                console.warn("La propiedad", name, "no existe")
                return ""
            },
            set(target, name, value) {
                if (name in target) {
                    Reflect.set(target, name, value)
                    self.trigger(name)
                } else {
                    console.warn("No puedes establecer el valor a", name)
                }
            },
        })
    }
    mount() {
        // v-text
        document.querySelectorAll("*[v-text]").forEach(el => {
            this.vText(el, this.$data, el.getAttribute("v-text"))
        })

        // v-model
        document.querySelectorAll("*[v-model]").forEach(el => {
            const name = el.getAttribute("v-model")
            this.vModel(el, this.$data, name)

            el.addEventListener("input", () => {
                Reflect.set(this.$data, name, el.value)
            })
        })

        Array.from(document.querySelectorAll("*"))
            .filter(el => {
                return [...el.attributes].some(attr =>
                    attr.name.startsWith("v-bind:")
                )
            })
            .forEach(el => {
                ;[...el.attributes].forEach(attribute => {
                    const name = attribute.value
                    const attr = attribute.name.split(":").pop()

                    this.vBind(el, this.$data, name, attr)
                })
            })
    }

    track(target, name) {
        if (!this.deps.has(name)) {
            const effect = () => {
                // v-text
                document.querySelectorAll(`*[v-text=${name}]`).forEach(el => {
                    this.vText(el, target, name)
                })
                // v-model
                document.querySelectorAll(`*[v-model=${name}]`).forEach(el => {
                    this.vModel(el, target, name)
                })
                // v-bind
                Array.from(document.querySelectorAll("*"))
                    .filter(el => {
                        return [...el.attributes].some(
                            attr =>
                                attr.name.startsWith("v-bind:") &&
                                attr.value == name
                        )
                    })
                    .forEach(el => {
                        ;[...el.attributes].forEach(attribute => {
                            const value = attribute.value
                            const attr = attribute.name.split(":").pop()
                            if (name == value) {
                                this.vBind(el, target, name, attr)
                            }
                        })
                    })
            }
            this.deps.set(name, effect)
        }
    }

    trigger(name) {
        const effect = this.deps.get(name)
        effect()
    }

    vText(el, target, name) {
        Reflect.set(el, "innerText", Reflect.get(target, name))
    }

    vModel(el, target, name) {
        Reflect.set(el, "value", Reflect.get(target, name))
    }

    vBind(el, target, name, attr) {
        Reflect.set(el, attr, Reflect.get(target, name))
    }
}

export default MiniVue
