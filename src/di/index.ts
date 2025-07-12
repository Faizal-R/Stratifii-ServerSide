import { DiControllers } from "./types";
import {Container} from 'inversify';

const container = new Container();

export const resolve =<T>(identifier: DiControllers): T => {
    return container.get<T>(identifier);
}

export default container;

