import {Operator} from "../Operator";
import {Or} from "./Or";

export const Nor: Operator = (packet, parameters) =>
    !Or(packet, parameters);
