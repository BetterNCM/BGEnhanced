import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";

export class RemoteRandImageBackgroundScenery extends BaseBackground {
    static backgroundTypeName = "必应每日";
    ImageUrl: string = "https://api.dujin.org/bing/1920.php";
    constructor() {
        super();
    }
    async backgroundElement() {
        return (
            <img
                src={`${this.ImageUrl}?${new Date().getTime()}`}
            />
        );
    }
    async previewBackground(): Promise<React.FC> {
        return () => <div style={{ background: `url(${this.ImageUrl}?${new Date().getTime()}) 0% 0% / cover` }} />;
    }
    static default(): RemoteRandImageBackgroundScenery {
        return new RemoteRandImageBackgroundScenery();
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        return new RemoteRandImageBackgroundScenery();
    }
}

