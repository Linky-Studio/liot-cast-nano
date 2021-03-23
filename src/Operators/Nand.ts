import {Operator} from "../Operator";
import {And} from "./And";

export const Nand: Operator = (packet, parameters) =>
    !And(packet, parameters);
