import { BaseBackground } from "./background";

export class RecursiveLockBackground extends BaseBackground {
    #recursiveCount = 0;
    resetRecursiveCount() {
        this.#recursiveCount = 0;
    }
    checkRecursive() {
        return (this.#recursiveCount++ > 50);
    }
}