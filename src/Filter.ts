import * as Operators from './Operators';
import {Reducer} from "./Reducer";
import {Operator} from "./Operator";

export type Packet = unknown;

export class Filter {
    condition: any;
    valid: boolean;

    constructor(condition: unknown) {
        this.valid = Filter.validateFilter(
            typeof condition === 'string'
                ? Filter.parseFilter(condition)
                : condition
        );
        if (this.valid)
            this.condition = condition;
    }


    public static evaluateReduce = (parameters: unknown[], packet: Packet, reducer: Reducer): unknown => parameters.map(p => Filter.evaluateFilterNode(packet, p)).reduce(reducer);

    public static validateFilterNode(condition: unknown) {
        //console.log('Validating node ', condition)
        if (typeof condition !== 'object' || condition === null || !(Object.keys(condition)[0] in Operators))
            return ['string', 'number'].indexOf(typeof condition) >= 0;
        //console.log("Is object with valid key")
        let array = condition[Object.keys(condition)[0] as keyof object];
        if (!Array.isArray(array))
            return false;
        //console.log('Valid array', array)
        for (const param of <unknown[]>array)
            if (!this.validateFilterNode(param)) return false;

        return true;
    }

    public static validateFilter = Filter.validateFilterNode;

    public static evaluateFilterNode(packet: Packet, condition: unknown) {
        switch (typeof condition) {
            case 'object':
                if (condition === null) return null;
                const operator = Object.keys(condition)[0];
                if (operator in Operators) {
                    const array = condition[operator as keyof object];
                    return Array.isArray(array) && (<unknown[]>array).length ? (<{ [key: string]: Operator }>Operators)[operator](packet, array) : null;
                }
                break;
            case 'string':
                return Filter.extractParameter(packet, condition);
            default:
                return condition;
        }
    }

    static parseFilter(text: string) {
        const lines = text.trim().replace(/\n\s+/g, '\n').split('\n');
        let output = '', depth = 0;
        const remaining = [];
        for (const line of lines) {
            if (line in Operators) {
                remaining[depth]--;
                output += `${spaces(depth)}{"${line}": [\n`;
                depth++;
                remaining[depth] = 2;
            } else {
                output += `${spaces(depth)}${line}${remaining[depth] == 2 ? ',' : ''}\n`;
                remaining[depth]--;
                if (!remaining[depth]) {
                    depth--;
                    output += `${spaces(depth)}]}${remaining[depth] > 0 ? ',' : ''}\n`
                }
            }
        }
        while (depth--) output += ']}';
        return JSON.parse(output);

        function spaces(depth: number) {
            return '  '.repeat(depth);
        }
    }

    public static extractParameter(packet: Packet, condition: string) {
        if (condition[0] == '$') {
            const parts = condition.substr(1).split('.');
            for (let p of parts)
                if (typeof packet === 'object' && packet !== null && p in packet)
                    packet = packet[p as keyof object];
                else return null;
            return packet;
        }
        return condition;
    }

    public evaluatePacket(packet: Packet) {
        return Filter.evaluateFilterNode(packet, this.condition);
    }
}
