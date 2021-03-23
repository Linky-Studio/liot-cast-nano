import {Filter} from './Filter';
import {Operator} from "./Operator";

const
    And: Operator = (packet, parameters) => Filter.evaluateReduce(parameters, packet, (a, b) => a && b),

    Nand: Operator = (packet, parameters) => !And(packet, parameters),

    Or: Operator = (packet, parameters) => Filter.evaluateReduce(parameters, packet, (a, b) => a || b),

    Nor: Operator = (packet, parameters) => !Or(packet, parameters),

    Equals: Operator = (packet, parameters) => {
        const paramZero = Filter.evaluateFilterNode(packet, parameters.splice(0, 1)[0]);
        for (let p of parameters)
            if (paramZero != Filter.evaluateFilterNode(packet, p))
                return false;
        return true;
    },

    Nequals: Operator = (packet, parameters) => !Equals(packet, parameters),

    Under: Operator = (packet, parameters) => {
        for (let p = 1; p < parameters.length; p++)
            if (Filter.evaluateFilterNode(packet, parameters[p - 1])
                >= Filter.evaluateFilterNode(packet, parameters[p]))
                return false;
        return true;
    },

    Nunder: Operator = (packet, parameters) => !Under(packet, parameters),

    Add: Operator = (packet, parameters) => Filter.evaluateReduce(parameters, packet, (a, b) => a + b),

    Sub: Operator = (packet, parameters) => Filter.evaluateReduce(parameters, packet, (a, b) => a - b),

    Mul: Operator = (packet, parameters) => Filter.evaluateReduce(parameters, packet, (a, b) => a * b),

    Div: Operator = (packet, parameters) => Filter.evaluateReduce(parameters, packet, (a, b) => a / b),

    Exp: Operator = (packet, parameters) => Filter.evaluateReduce(parameters, packet, (a, b) => a ** b),

    Includes: Operator = (packet, parameters) => {
        const paramZero = Filter.evaluateFilterNode(packet, parameters.splice(0, 1)[0]);
        for (let parameter of parameters)
            if (paramZero.includes(Filter.evaluateFilterNode(packet, parameter)))
                return false;
        return true;
    };

export {And, Nand, Or, Nor, Equals, Nequals, Under, Nunder, Add, Sub, Mul, Div, Exp, Includes};
