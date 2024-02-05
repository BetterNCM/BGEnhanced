import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";
import Swal from "sweetalert2";

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
    async previewBackground(): Promise<React.FC> {
        const url = await this.getMountedImageUrl();
        return () => <div style={{ background: `url(${url}) 0% 0% / cover` }} />;
    }

    static default(): ImageBackground {
        return new ImageBackground("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const path = await betterncm.app.openFileDialog(".webp .png .jpg .jpeg .bmp .gif\0", "./");
        if (!betterncm_native.fs.exists(path)) {
            Swal.fire('添加背景失败',
                `原因可能为：
1. 你选中的路径内有特殊字符（中文，制表符等）
2. 你选中的路径不存在`, 'error')
            return null;
        }
        if (path) return new ImageBackground(path);
        return null;
    }
}

