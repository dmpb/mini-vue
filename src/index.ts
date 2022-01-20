class MiniVue {
    deps = new Map()
    origen: Object
    $data: Object

    constructor(options: { data: () => Object }) {
        this.origen = options.data()
        const self: MiniVue = this

        // Destino
        this.$data = new Proxy(this.origen, {
            get(target: object, name: string) {
                if (name in target) {
                    self.track(target, name)
                    return Reflect.get(target, name)
                }
                console.warn("La propiedad", name, "no existe")
                return ""
            },
            set(target: object, name: string, value: string): boolean {
                if (name in target) {
                    Reflect.set(target, name, value)
                    self.trigger(name)
                    return true
                } else {
                    console.warn("No puedes establecer el valor a", name)
                    return false
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
                const value = (<HTMLInputElement>el).value

                Reflect.set(this.$data, name, value)
            })
        })

        Array.from(document.querySelectorAll("*"))
            .filter(el => {
                return Array.from(el.attributes).some(attr =>
                    attr.name.startsWith("v-bind:")
                )
            })
            .forEach(el => {
                Array.from(el.attributes).forEach(attribute => {
                    const name = attribute.value
                    const attr = attribute.name.split(":").pop()

                    this.vBind(el, this.$data, name, attr)
                })
            })
    }

    track(target: Object, name: string) {
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
                        return Array.from(el.attributes).some(
                            attr =>
                                attr.name.startsWith("v-bind:") &&
                                attr.value == name
                        )
                    })
                    .forEach(el => {
                        Array.from(el.attributes).forEach(attribute => {
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

    trigger(name: string) {
        const effect = this.deps.get(name)
        effect()
    }

    vText(el: object, target: object, name: PropertyKey) {
        Reflect.set(el, "innerText", Reflect.get(target, name))
    }

    vModel(el: object, target: object, name: PropertyKey) {
        Reflect.set(el, "value", Reflect.get(target, name))
    }

    vBind(el: object, target: object, name: PropertyKey, attr: PropertyKey) {
        Reflect.set(el, attr, Reflect.get(target, name))
    }
}

export default MiniVue
