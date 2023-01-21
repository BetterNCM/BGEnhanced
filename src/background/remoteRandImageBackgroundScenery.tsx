import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";
import { RemoteImageBackground } from "./remoteImageBackground";

export class RemoteRandImageBackgroundScenery extends RemoteImageBackground {
    static backgroundTypeName = "必应每日";
    constructor() {
        super("https://api.dujin.org/bing/1920.php");
    }
    static default(): RemoteRandImageBackgroundScenery {
        return new RemoteRandImageBackgroundScenery();
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        return new RemoteRandImageBackgroundScenery();
    }
}

