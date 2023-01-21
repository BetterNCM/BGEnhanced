import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";

export class ImageBackground extends BaseBackground {
    static backgroundTypeName = "图片";
    constructor(ImageUrl: string) {
        super();
        this.ImageUrl = ImageUrl;
    }
    ImageUrl: string;

    #mountedImageUrl?: Promise<string>;
    private async getMountedImageUrl() {
        if (this.#mountedImageUrl === undefined) this.#mountedImageUrl = betterncm.fs.mountFile(this.ImageUrl);
        return await this.#mountedImageUrl;
    }

    async backgroundElement() {
        return (
            <img
                src={await this.getMountedImageUrl()}
            />
        );
    }
    async previewBackground(): Promise<ReactElement> {
        return <div style={{ background: `url(${await this.getMountedImageUrl()}) 0% 0% / cover` }} />;
    }

    static default(): ImageBackground {
        return new ImageBackground("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const path = await betterncm.app.openFileDialog(".webp .png .jpg\0", "./");
        if (path) return new ImageBackground(path);
        return null;
    }
}

