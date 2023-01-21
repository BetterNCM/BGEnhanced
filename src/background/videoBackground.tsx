import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";

export class VideoBackground extends BaseBackground {
    static backgroundTypeName = "视频背景";
    constructor(videoUrl: string) {
        super();
        this.videoUrl = videoUrl;
    }
    videoUrl: string;
    get backgroundElement() {
        return (
            <video
                autoPlay={true}
                loop={true}
                src={BETTERNCM_FILES_PATH + this.videoUrl}
            />
        );
    }
    get previewBackground(): ReactElement {
        return <video src={BETTERNCM_FILES_PATH + this.videoUrl} />;
    }
    static default(): VideoBackground {
        return new VideoBackground("");
    }
}
