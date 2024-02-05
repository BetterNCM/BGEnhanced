import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";
import Swal from "sweetalert2";

export class VideoBackground extends BaseBackground {
    static backgroundTypeName = "视频";
    constructor(videoUrl: string) {
        super();
        this.videoUrl = videoUrl;
    }
    videoUrl: string;

    #mountedVideoUrl?: Promise<string>;
    private async getMountedVideoUrl() {
        if (this.#mountedVideoUrl === undefined) this.#mountedVideoUrl = betterncm.fs.mountFile(this.videoUrl);
        return await this.#mountedVideoUrl;
    }

    async backgroundElement() {
        return (
            <video
                autoPlay={true}
                loop={true}
                muted={true}
                src={await this.getMountedVideoUrl()}
            />
        );
    }
    async previewBackground(): Promise<React.FC> {
        const url = await this.getMountedVideoUrl();
        return () => <video preload="metadata" src={url} />;
    }

    static default(): VideoBackground {
        return new VideoBackground("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const path = await betterncm.app.openFileDialog(".mp4, .webm\0", "./");
        if(!betterncm_native.fs.exists(path)) {
            Swal.fire('添加背景失败',
`原因可能为：
1. 你选中的路径内有特殊字符（中文，制表符等）
2. 你选中的路径不存在`,'error')
            return null;
        }
        if (path) return new VideoBackground(path);
        return null;
    }
}

