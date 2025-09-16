export class ClassWithPrivateMethod {
    #name = '';

    #setName(name) {
        this.#name = name;
    }

    getName() {
        return this.#name;
    }
}
