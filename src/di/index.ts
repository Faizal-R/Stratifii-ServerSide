import { DI_CONTROLLERS } from "./types";
import {Container} from 'inversify';

const container = new Container();

export const resolve =<T>(identifier: DI_CONTROLLERS): T => {
    return container.get<T>(identifier);
}

export default container;

