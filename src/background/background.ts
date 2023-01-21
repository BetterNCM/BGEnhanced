import { Component, ReactElement } from "react";
import { NotImplementedError } from "../errors";

export class BaseBackground {
    current: boolean = false;
    static backgroundTypeName: string;
    get previewBackground(): ReactElement {
        throw new NotImplementedError(
            "Method previewBackground is not implemented",
        );
    }
    get backgroundElement(): ReactElement {
        throw new NotImplementedError(
            "Method backgroundElement is not implemented",
        );
    }
    static default(): BaseBackground {
        throw new NotImplementedError("Method default is not implemented");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        throw new NotImplementedError("Method create is not implemented");
    }
}
