import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";
import { RemoteImageBackground } from "./remoteImageBackground";
import Swal from "sweetalert2";

export class RemoteRandImageBackgroundLoli extends RemoteImageBackground {
    static backgroundTypeName = "随机二次元";
    constructor(url:string) {
        super(url);
    }
    static default(): RemoteRandImageBackgroundLoli {
        return new RemoteRandImageBackgroundLoli("");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        Swal.showLoading(null);
        const redirectedUrl=await fetch("https://www.loliapi.com/acg/pc/");
        Swal.clickCancel();
        return new RemoteRandImageBackgroundLoli(redirectedUrl.url);
    }
}

