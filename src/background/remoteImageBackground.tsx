import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";

export class RemoteImageBackground extends BaseBackground {
    static backgroundTypeName = "图片";
    constructor(ImageUrl: string) {
        super();
        this.ImageUrl = ImageUrl;
    }
    ImageUrl: string;


    async backgroundElement() {
        return (
            <img
                src={this.ImageUrl}
            />
        );
    }
    async previewBackground(): Promise<ReactElement> {
        return <div style={{ background: `url(${this.ImageUrl}) 0% 0% / cover`}} />;
    }

    static default(): RemoteImageBackground {
        return new RemoteImageBackground("");
    }
}

