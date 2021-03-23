import {Operator} from "../Operator";
import {Filter} from "../Filter";

export const Exponent: Operator = (packet, parameters) =>
    Filter.evaluateReduce(parameters, packet, (a, b) => a ** b);
