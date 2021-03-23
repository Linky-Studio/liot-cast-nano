import {Operator} from "../Operator";
import {Filter} from "../Filter";

export const Under: Operator = (packet, parameters) => {
    let lastNode = Filter.evaluateFilterNode(packet, parameters[0]);
    for (let p = 1; p < parameters.length; p++) {
        const currentNode = Filter.evaluateFilterNode(packet, parameters[p]);
        if (lastNode >= currentNode)
            return false;
        lastNode = currentNode;
    }
    return true;
};
