import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";

let lastUrl = '';

export class CoverImageBackground extends BaseBackground {
    static backgroundTypeName = "当前封面";
    constructor(ImageUrl: string) {
        super();
        this.ImageUrl = ImageUrl;
    }
    ImageUrl: string;


    async backgroundElement() {
        return (
            <img
                className="BGE-coverImageBG"
                src={";"}
            />
        );
    }
    async previewBackground() {
        return () => <div className="BGE-coverImageBG" style={{ background: "transparent" }} />;
    }

    static async askAndCreate(): Promise<BaseBackground | null> {
        lastUrl = "";
        return new CoverImageBackground("");
    }

    static default(): CoverImageBackground {
        return new CoverImageBackground("");
    }
}


setInterval(async () => {
    const preloadImage = src =>
        new Promise((resolve, reject) => {
            const image = new Image()
            image.onload = resolve
            image.onerror = reject
            image.src = src
        })

    if (document.querySelector('.normal.j-cover, .cmd-image')) {
        const url = `${(document.querySelector('.normal.j-cover, .cmd-image')! as HTMLImageElement).src.split("?")[1]}`;
        if (lastUrl !== url) {
            lastUrl = url;
            await preloadImage(url);
        }

        for (const img of document.querySelectorAll(".BGE-coverImageBG") as unknown as HTMLElement[]) {
            if (img.getAttribute("src")) img.setAttribute("src", url);
            if (img.style.background) img.style.background = `url(${url}) 0% 0% / cover`;
        }
    }

}, 300);