import { ReactElement } from "react";
import { NotImplementedError } from "../errors";
import { BaseBackground } from "./background";
import { BackgroundPreviewList, selfPlugin } from "..";
import Swal from "sweetalert2";
import { MdSelectAll } from "react-icons/md";
import { RecursiveLockBackground } from "./RecursiveLockBackground";

export class RandomBackground extends RecursiveLockBackground {
    async onConfig(): Promise<undefined> {
        const ConfigMenu = () => {
            const [excludes, setExcludes] = React.useState(this.excludeList);
            const currents = React.useMemo(() =>
                selfPlugin.backgroundList.map(bg => bg.id).filter(id => !excludes.includes(id)),
                [excludes]);

            React.useEffect(() => {
                this.excludeList = excludes;
            }, [excludes]);

            const checkBackground = (bg) => {
                if (excludes.includes(bg.id)) setExcludes(excludes.filter(id => id !== bg.id));
                else setExcludes([...excludes, bg.id]);
            }

            const filteredBGList = React.useMemo(() =>
                selfPlugin.backgroundList.filter(bg => {
                    return !(bg.constructor as typeof BaseBackground).attributes?.includes("NoRandomBG")
                })
                , []);

            return <>
                <BackgroundPreviewList backgroundList={filteredBGList}
                    currentIDs={currents}
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

        const p = Swal.fire({ title: "随机背景设置", html: "<div id=RandBGConfigContainer class=BGEnhanced-Config style='font-size:.5em;' />" });

        ReactDOM.render(<ConfigMenu />, document.getElementById("RandBGConfigContainer"));

        await p;

        this.resetRecursiveCount();

        return;
    }
    static backgroundTypeName: string = "随机抽选";
    static attributes = ["NoRandomBG"];

    excludeList: string[] = [];
    #randBGElement: Promise<BaseBackground>
    async #randomBackground() {
        if (!this.#randBGElement) {
            this.#randBGElement = Promise.race([
                betterncm.utils.waitForFunction(() => selfPlugin.backgroundList.length),
                betterncm.utils.delay(1000).then(_ => Promise.reject("Timeout"))
            ]).then(() => selfPlugin.backgroundList.filter(bg => {
                return !(bg.constructor as typeof BaseBackground).attributes?.includes("NoRandomBG") && !this.excludeList.includes(bg.id)

            }).sort(_ => Math.random() - 0.5)[0]);
        }
        return this.#randBGElement;
    }

    async previewBackground(): Promise<ReactElement> {
        if(this.checkRecursive()) return <div>Potential circular reference detected.</div>;
        
        return (await this.#randomBackground()).previewBackground();
    }
    async backgroundElement(): Promise<ReactElement> {
        if(this.checkRecursive()) return <div>Potential circular reference detected.</div>;

        return <></>
    }
    static default(): BaseBackground {
        return new RandomBackground;
    }
    static async askAndCreate(): Promise<BaseBackground | null> {
        return new RandomBackground;
    }
}