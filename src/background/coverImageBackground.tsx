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
            <div className="BGE-coverImageBG">
                <img
                    className="BGE-coverImageBG-a"
                />
                <img
                    className="BGE-coverImageBG-b"
                />
            </div>
        );
    }
    async previewBackground() {
        return () => <div className="BGE-coverImageBGPreview" style={{ background: "transparent" }} />;
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
            await preloadImage(url).catch(() => { });
        }

        for (const img of document.querySelectorAll(".BGE-coverImageBG") as unknown as HTMLElement[]) {
            // a-b fade in fade out
            const a = img.querySelector(".BGE-coverImageBG-a") as HTMLImageElement;
            const b = img.querySelector(".BGE-coverImageBG-b") as HTMLImageElement;

            if (a.src !== url) {
                b.style.opacity = '0'
                b.src = url;
                await new Promise(r => {
                    b.addEventListener("load", r)
                    b.addEventListener("error", r)
                });
                a.style.opacity = "0";
                b.style.opacity = "1";

                await new Promise(r => setTimeout(r, 1100));

                b.classList.add("BGE-coverImageBG-a");
                b.classList.remove("BGE-coverImageBG-b");

                a.classList.add("BGE-coverImageBG-b");
                a.classList.remove("BGE-coverImageBG-a");
                a.src = ''
                b.parentElement!.appendChild(a);
            }
        }

        for(const img of document.querySelectorAll('.BGE-coverImageBGPreview') as unknown as HTMLElement[]) {
            img.style.background = `url(${url}) 0% 0% / cover`;
        }
    }

}, 300);