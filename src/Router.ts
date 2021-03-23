import {Listener} from "./Listener";

export class Router {

    constructor(public listeners: Listener[] = []) {
    }

    public listen(listener: Listener) {
        this.listeners.push(listener);
        return true;
    }

    public send(data: unknown) {
        console.log('do send', data, this.listeners);
        this.listeners.forEach(listener => listener.filter?.evaluatePacket(data) && listener.action?.(data));
    }

    public silence(listener: Listener) {
        const pos = this.listeners.indexOf(listener);
        this.listeners.splice(pos, 1);
    }
}