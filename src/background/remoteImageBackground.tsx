import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";
import Swal from "sweetalert2";

export class RemoteImageBackground extends BaseBackground {
    static backgroundTypeName = "在线图片";
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
        return <div style={{ background: `url(${this.ImageUrl}) 0% 0% / cover` }} />;
    }

    static default(): RemoteImageBackground {
        return new RemoteImageBackground("");
    }

    async onConfig(): Promise<undefined> {
        const result = await Swal.fire({
            title: "修改在线图片背景URL",
            inputValue: this.ImageUrl,
            input: "text",
        });
        if (result.value) this.ImageUrl = result.value;
        return;
    }

    static async askAndCreate(): Promise<BaseBackground | null> {
        const result = await Swal.fire({
            title: "创建一个在线图片背景",
            text: "你可以在此写入一个指向图片的URL。",
            input: "text",
        });
        if (result.value) return new RemoteImageBackground(result.value);
        else return null;
    }
}

