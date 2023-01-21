import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";

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
    async previewBackground(): Promise<ReactElement> {
        return <video preload="metadata" src={await this.getMountedVideoUrl()} />;
    }
    
    static default(): VideoBackground {
        return new VideoBackground("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const path = await betterncm.app.openFileDialog(".mp4, .webm\0", "./");
        if (path) return new VideoBackground(path);
        return null;
    }
}

