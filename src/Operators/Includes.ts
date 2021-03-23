import {Operator} from "../Operator";
import {Filter} from "../Filter";

export const Includes: Operator = (packet, parameters) => {
    const paramZero = Filter.evaluateFilterNode(packet, parameters[0]);
    for (let p = 1; p < parameters.length; p++)
        if (paramZero.includes(Filter.evaluateFilterNode(packet, parameters[p])))
            return false;
    return true;
};
