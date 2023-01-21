/**
 * @fileoverview
 * 此处的脚本将会在插件管理器加载插件期间被加载
 * 一般情况下只需要从这个入口点进行开发即可满足绝大部分需求
 */
import {
    MdAdd,
    MdDelete,
    MdDesktopWindows,
    MdSelectAll,
    MdSettings,
    MdWallpaper,
} from "react-icons/md";
import { BaseBackground } from "./background/background";
import { CSSBackground } from "./background/cssBackground";
import { VideoBackground } from "./background/videoBackground";
import { useLocalStorage } from "./hooks";
import "./index.scss";
import { STORE_BGLIST, STORE_BGMODE } from "./keys";
import { SnippetInfo } from "./model";
import { ReactElement } from "react";

let configElement = document.createElement("div");
const BGDom = document.createElement("div");
BGDom.classList.add("BGEnhanced-BackgoundDom");

const BackgroundTypes = [VideoBackground, CSSBackground];

plugin.onLoad((selfPlugin) => {
    ReactDOM.render(<Main />, BGDom);
    document.body.appendChild(BGDom);
});

setInterval(
    () =>
        (document.querySelector(".BGEnhanced-styles").innerHTML =
            betterncm_native.fs.readFileText(`${plugin.pluginPath}/index.css`)),
    600,
);

function Main() {
    const stylesheet = React.useMemo(
        () =>
            betterncm_native.fs.readFileText(`${plugin.pluginPath}/index.css`),
        [],
    );

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    React.useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }

        window.addEventListener("resize", handleResize);
    });

    const [backgroundMode, setBackgroundMode] = useLocalStorage(
        STORE_BGMODE,
        "cover",
    );

    const [backgroundList, setBackgroundList] = useLocalStorage<
        BaseBackground[]
    >(
        STORE_BGLIST,
        [],
        (s) => {
            const obj = JSON.parse(s);
            return obj
                .map((value: { type: string }) => {
                    const def = BackgroundTypes.find(
                        (type) => type.name === value.type,
                    )?.default();
                    return def && Object.assign(def, value);
                })
                .filter((v: any) => v);
        },
        (s) => {
            return JSON.stringify(
                s.map((v) => ({
                    ...v,
                    type: BackgroundTypes.find((type) => v instanceof type)
                        ?.name,
                })),
            );
        },
    );

    const currentBackground = React.useMemo(() => {
        return (
            backgroundList.find((bg) => bg.current) ??
            backgroundList[0] ??
            new CSSBackground("linear-gradient(45deg, #0037ff, #005aff)")
        );
    }, [backgroundList]);

    async function askAndAddBackground(background) {
        const result = await background.askAndCreate();
        console.log(backgroundList.concat([result]));
        if (result != null) setBackgroundList(backgroundList.concat([result]));
    }

    function removeBackground(background: BaseBackground) {
        setBackgroundList(backgroundList.filter(bg => bg !== background));
    }

    function selectBackground(background: BaseBackground) {
        setBackgroundList(
            backgroundList.map((bg) => {
                if (bg === background) bg.current = true;
                else bg.current = false;
                return bg;
            }),
        );
    }

    function PreviewBackground(background: BaseBackground) {
        return (
            // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
            <span
                
                className={`bg-block ${background.current && "selected"}`}
            >
                {background.previewBackground}
                <div className="buttons">
                    <span className="btn">
                        <MdSettings />
                    </span>
                    {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
<span
                        className="btn"
                        onClick={() => removeBackground(background)}
                    >
                        <MdDelete />
                    </span>
                    {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
<span
                        className="btn"
                        onClick={() => selectBackground(background)}
                    >
                        <MdSelectAll />
                    </span>
                    
                    
                </div>
            </span>
        );
    }

    return (
        <>
            <div
                className={`background mode-${backgroundMode}`}
                style={
                    {
                        "--win-width": dimensions.width,
                        "--win-height": dimensions.height,
                    } as React.CSSProperties
                }
            >
                {currentBackground.backgroundElement}
            </div>

            {ReactDOM.createPortal(
                <>
                    <div className="BGEnhanced-Config">
                        <div className="buttons">
                            <span className="extendable u-ibtn5">
                                <span className="ico">
                                    <MdAdd />
                                </span>
                                <span className="content">
                                    {BackgroundTypes.map((type) => (
                                        // rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
                                        <span
                                            className="btn"
                                            onClick={() =>
                                                askAndAddBackground(type)
                                            }
                                        >
                                            {type.backgroundTypeName}
                                        </span>
                                    ))}
                                </span>
                            </span>
                            <span className="extendable u-ibtn5">
                                <span className="ico">
                                    <MdDesktopWindows />
                                </span>
                                <span className="content">
                                    {/* rome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                                    <span
                                        className="btn"
                                        onClick={() =>
                                            setBackgroundMode("cover")
                                        }
                                    >
                                        覆盖
                                    </span>
                                </span>
                            </span>
                        </div>
                        <div className="backgrounds">
                            {backgroundList.map((v) => PreviewBackground(v))}
                        </div>
                    </div>
                    <style className="BGEnhanced-styles">{stylesheet}</style>

                    {ReactDOM.createPortal(<></>, BGDom)}
                </>,
                configElement,
            )}
        </>
    );
}

plugin.onConfig(() => {
    return configElement;
});
