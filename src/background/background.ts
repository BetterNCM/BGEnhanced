import { Component, ReactElement } from "react";
import { NotImplementedError } from "../errors";

function makeId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export class BaseBackground {
    async onConfig(): Promise<undefined> {
        return;
    }
    current: boolean = false;
    id: string = makeId(12);
    static attributes: string[] = [];
    static backgroundTypeName: string;
    async previewBackground(): Promise<ReactElement> {
        throw new NotImplementedError(
            "Method previewBackground is not implemented",
        );
    }
    async backgroundElement(): Promise<ReactElement> {
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

    hooks__onBeforeAddBackground(newBG: BaseBackground) { }
    hooks__onBeforeRemoveBackground(removedBG: BaseBackground) { }
}
