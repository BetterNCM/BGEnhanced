import { ReactElement } from "react";
import { NotImplementedError } from "../errors";
import { BaseBackground } from "./background";
import { BackgroundPreviewList, selfPlugin } from "..";
import Swal from "sweetalert2";
import { MdSelectAll } from "react-icons/md";
import { RecursiveLockBackground } from "./RecursiveLockBackground";

export class MaskedBackground extends RecursiveLockBackground {
    async onConfig(): Promise<undefined> {
        const ConfigMenu = () => {
            const [target, setTarget] = React.useState(this.target);
            const [maskColorMain, setMaskColorMain] = React.useState<string>(this.maskColor.slice(0, 7));
            const [maskColorOpacity, setMaskColorOpacity] = React.useState<number>(parseInt(this.maskColor.slice(7, 9), 16));
            const [maskBlur, setMaskBlur] = React.useState<number>(this.maskBlur);

            // https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
            function pad(num, size) {
                var s = "000" + num;
                return s.substr(s.length - size);
            }

            React.useEffect(() => {
                this.target = target;
                this.maskColor = maskColorMain + pad(maskColorOpacity.toString(16), 2);
                console.log(pad(maskColorOpacity.toString(16), 2))
                this.maskBlur = maskBlur;
            }, [target, maskColorMain, maskColorOpacity, maskBlur]);

            const checkBackground = (bg) => {
                setTarget(bg.id);
            }

            const filteredBGList = React.useMemo(() =>
                selfPlugin.backgroundList.filter(bg => bg !== this)
                , []);

            return <>
                <div>
                    <span>
                        遮罩颜色：
                    </span>
                    <input type="color" value={maskColorMain} onChange={(e) => setMaskColorMain(e.target.value)} />
                    <br />
                    <span>
                        遮罩透明度：
                    </span>
                    <input type="range" value={maskColorOpacity} min={0} max={255} step={1} onChange={(e) => setMaskColorOpacity(parseFloat(e.target.value))} />
                    <br />
                    <span>
                        遮罩高斯模糊：
                    </span>
                    <input type="range" value={maskBlur} min={0} max={60} step={1} onChange={(e) => setMaskBlur(parseFloat(e.target.value))} />
                    <br />
                </div>
                <div>
                    遮罩对象：
                </div>
                <BackgroundPreviewList backgroundList={filteredBGList}
                    currentIDs={[target]}
                    buttons={bg => <>
                        <span
                            className="btn"
                            onClick={() => checkBackground(bg)}
                        >
                            <MdSelectAll color="white" />
                        </span>
                    </>} />
            </>
        }

        const p = Swal.fire({ title: "遮罩背景设置", html: "<div id=MaskedBackgroundConfigContainer class=BGEnhanced-Config style='font-size:.5em;' />" });

        ReactDOM.render(<ConfigMenu />, document.getElementById("MaskedBackgroundConfigContainer"));

        await p;

        this.#targetBGElement = undefined;
        this.resetRecursiveCount();

        return;
    }
    static backgroundTypeName: string = "遮罩背景";
    static attributes = ["recursive"];

    target: string
    maskColor = "#ffffff22";
    maskBlur = 0;
    #targetBGElement: Promise<BaseBackground> | undefined;


    async #targetBackground() {
        if (!this.#targetBGElement) {
            this.#targetBGElement = Promise.race([
                betterncm.utils.waitForFunction(() => selfPlugin.backgroundList.length),
                betterncm.utils.delay(1000).then(_ => Promise.reject("Timeout"))
            ]).then(() => selfPlugin.backgroundList.find(bg => bg.id === this.target));
        }
        return this.#targetBGElement;
    }

    async previewBackground(): Promise<ReactElement> {
        if (this.checkRecursive()) return <div>Potential circular reference detected.</div>;

        return <>
            {await (await this.#targetBackground()).previewBackground()}
            <div className={`bgMask-${this.id}`} />
            <style>
                {this.#getStyleSheet()}
            </style>
        </>;
    }

    #getStyleSheet() {
        return `
.bgMask-${this.id}{
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom:0;
    background:${this.maskColor};
    backdrop-filter:blur(${this.maskBlur}px);
}
`;
    }

    async backgroundElement(): Promise<ReactElement> {
        if (this.checkRecursive()) return <div>Potential circular reference detected.</div>;

        return <>
            {await (await this.#targetBackground()).backgroundElement()}
            <div className={`bgMask-${this.id}`} />
            <style>
                {this.#getStyleSheet()}
            </style>
        </>

    }
    static default(): BaseBackground {
        return new MaskedBackground;
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        const bg = new MaskedBackground;
        await bg.onConfig();
        return bg;
    }
}