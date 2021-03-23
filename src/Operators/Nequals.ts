import {Operator} from "../Operator";
import {Equals} from "./Equals";

export const Nequals: Operator = (packet, parameters) =>
    !Equals(packet, parameters);