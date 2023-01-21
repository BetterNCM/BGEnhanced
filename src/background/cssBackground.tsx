import { Component, ReactElement } from "react";
import { BaseBackground } from "./background";
import Swal from "sweetalert2";

export class CSSBackground extends BaseBackground {
    static backgroundTypeName = "CSS背景";
    constructor(css: string) {
        super();
        this.css = css;
    }
    css: string;
    get backgroundElement() {
        return <div style={{ background: this.css }} />;
    }
    get previewBackground(): ReactElement {
        return <div style={{ background: this.css }} />;
    }
    static default(): CSSBackground {
        return new CSSBackground("gray");
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const result = await Swal.fire({
            title: "创建一个CSS背景",
            text: "你可以在此写入任何可以作为 background 值的字符串。它将被作为背景使用。",
            input: "text",
        });
        if(result.value)return new CSSBackground(result.value);
        else return null;
    }
}
