import {Operator} from "../Operator";
import {Under} from "./Under";

export const Nunder: Operator = (packet, parameters) =>
    !Under(packet, parameters);