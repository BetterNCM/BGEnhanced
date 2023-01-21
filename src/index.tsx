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
import { useInterval, useLocalStorage, usePromise } from "./hooks";
import "./index.scss";
import { STORE_BGBLUR, STORE_BGBRIGHTNESS, STORE_BGLIST, STORE_BGMODE, STORE_BGSCALE } from "./keys";
import { ReactElement } from "react";
import { ImageBackground } from "./background/imageBackground";
import { RemoteRandImageBackgroundLoli } from "./background/remoteRandImageBackgroundLoli";
import { RemoteRandImageBackgroundScenery } from "./background/remoteRandImageBackgroundScenery";

let configElement = document.createElement("div");
const BGDom = document.createElement("div");
BGDom.classList.add("BGEnhanced-BackgoundDom");

const BackgroundTypes = [VideoBackground, CSSBackground, ImageBackground, RemoteRandImageBackgroundLoli, RemoteRandImageBackgroundScenery];

plugin.onLoad((selfPlugin) => {
    ReactDOM.render(<Main />, BGDom);
    document.body.appendChild(BGDom);
});

setInterval(
    () =>
    (document.querySelector(".BGEnhanced-styles")!.innerHTML =
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
            setDimensions(dimensions => {
                const newDimension = {
                    height: window.innerHeight,
                    width: window.innerWidth,
                };

                if (newDimension.width !== dimensions.width ||
                    newDimension.height !== dimensions.height)
                    return newDimension
                return dimensions
            });
        }

        window.addEventListener("resize", handleResize);
    });

    const [backgroundScale, setBackgroundScale] = useLocalStorage(
        STORE_BGSCALE,
        1,
    );

    const [backgroundBrightness, setBackgroundBrightness] = useLocalStorage(
        STORE_BGBRIGHTNESS,
        1,
    );

    const [backgroundBlur, setBackgroundBlur] = useLocalStorage(
        STORE_BGBLUR,
        0,
    );

    const [backgroundMode, setBackgroundMode] = useLocalStorage(
        STORE_BGMODE,
        "cover-centered",
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

    const [backgroundPreviewList, setBackgroundPreviewList] = React.useState<([ReactElement | null, BaseBackground])[]>([]);

    React.useEffect(() => {
        const previewList: ([ReactElement | null, BaseBackground])[] = [];

        for (const backgroundIndex in backgroundList) {
            const background = backgroundList[backgroundIndex];

            const previous = backgroundPreviewList.find(([_, base]) => background === base);
            if (previous !== undefined) {
                previewList.push(previous);
            } else {
                previewList.push([null, background]);
                background.previewBackground().then(preview => {
                    setBackgroundPreviewList((prev) => prev.map(previewVal => {
                        if (previewVal[1] === background) return [preview, background];
                        return previewVal;
                    }))
                })
            }
        }

        setBackgroundPreviewList(previewList);
    }, [backgroundList]);

    const currentBackground = React.useMemo(() => {
        return (
            backgroundList.find((bg) => bg.current) ??
            backgroundList[0] ??
            new CSSBackground("linear-gradient(45deg, #0037ff, #005aff)")
        );
    }, [backgroundList]);



    const [currentBackgroundElement] = usePromise(
        React.useMemo(() => currentBackground.backgroundElement(), [currentBackground])
        , [currentBackground]);

    const backgroundParentRef = React.useRef<null | HTMLDivElement>(null);

    const recalcBGSize = React.useCallback(() => {
        if (backgroundParentRef.current && backgroundParentRef.current.firstElementChild) {
            const bgDom = backgroundParentRef.current.firstElementChild as HTMLDivElement;

            bgDom.setAttribute("style", "");
            const { width, height } = bgDom.getClientRects()[0];

            if (backgroundMode === "cover") {
                const scale = Math.max(dimensions.width / width, dimensions.height / height);
                bgDom.style.width = `${width * scale}px`;
                bgDom.style.height = `${height * scale}px`;
            }

            if (backgroundMode === "cover-centered") {
                const scale = Math.max(dimensions.width / width, dimensions.height / height);

                bgDom.style.width = `${width * scale}px`;
                bgDom.style.height = `${height * scale}px`;

                bgDom.style.marginLeft = `-${(width * scale - dimensions.width) / 2}px`;
                bgDom.style.marginTop = `-${(height * scale - dimensions.height) / 2}px`;
            }

            if (backgroundMode === "stretch") {
                bgDom.style.objectFit = "fill";
                bgDom.style.width = `${dimensions.width}px`;
                bgDom.style.height = `${dimensions.height}px`;
            }
        }
    }, [dimensions, backgroundMode, backgroundParentRef]);

    useInterval(recalcBGSize, 1000);
    React.useEffect(recalcBGSize, [dimensions, backgroundMode, backgroundParentRef])

    async function askAndAddBackground(background) {
        const result = await background.askAndCreate();
        console.log(backgroundList.concat([result]));
        if (result != null) setBackgroundList(backgroundList.concat([result]));
    }

    function removeBackground(background: BaseBackground) {
        setBackgroundList(backgroundList.filter((bg) => bg !== background));
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

    function BackgroundModeElement({ name, id }: { name: string, id: string }) {
        return (
            <span
                className={`btn ${backgroundMode === id &&
                    "enabled"
                    }`}
                onClick={() =>
                    setBackgroundMode(id)
                }
            >
                {name}
            </span>
        )
    }

    function PreviewBackground(background: BaseBackground, preview: ReactElement | null) {
        return (
            <span className={`bg-block ${background.current && "selected"}`}>
                {preview}

                <div className="info">
                    <div className="name">
                        {(background.constructor as any).backgroundTypeName}
                    </div>

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
                </div>
            </span>
        );
    }

    return (
        <>
            <div
                style={{
                    transform: `scale(${backgroundScale})`,
                    filter: `blur(${backgroundBlur}px) brightness(${backgroundBrightness})`
                }}
                className={`background mode-${backgroundMode}`}
                ref={backgroundParentRef}
            >
                {currentBackgroundElement}
            </div>

            <style className="BGEnhanced-styles">{stylesheet}</style>

            {ReactDOM.createPortal(
                <>
                    <div className="BGEnhanced-Config">
                        <div className="buttons">
                            <span className="full u-ibtn5">
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
                                    <BackgroundModeElement name="覆盖" id="cover" />
                                    <BackgroundModeElement name="覆盖居中" id="cover-centered" />
                                    <BackgroundModeElement name="拉伸" id="stretch" />
                                </span>
                            </span>
                        </div>
                        <div className="universalOptions u-ibtn5" style={{
                            width: '100%',
                            height: 'max-content',
                            borderRadius: '.8em',
                            padding: '.5em .6ex',
                            opacity: '0.9',
                            marginBottom: "1em"
                        }}>
                            <div>
                                <span style={{ margin: ".5em" }}>缩放</span>
                                <input type="range"
                                    className="range"
                                    min={0.8} max={1.4} step={0.01}
                                    style={{ width: "calc(100% - 3em)", padding: ".5em" }}
                                    onChange={(e) => setBackgroundScale(parseFloat(e.target.value))}
                                    defaultValue={backgroundScale} />

                            </div>

                            <div>
                                <span style={{ margin: ".5em" }}>模糊</span>
                                <input type="range"
                                    className="range"
                                    min={0} max={60} step={0.1}
                                    style={{ width: "calc(100% - 3em)", padding: ".5em" }}
                                    onChange={(e) => setBackgroundBlur(parseFloat(e.target.value))}
                                    defaultValue={backgroundBlur} />

                            </div>

                            <div>
                                <span style={{ margin: ".5em" }}>明度</span>
                                <input type="range"
                                    className="range"
                                    min={0} max={1} step={0.01}
                                    style={{ width: "calc(100% - 3em)", padding: ".5em" }}
                                    onChange={(e) => setBackgroundBrightness(parseFloat(e.target.value))}
                                    defaultValue={backgroundBrightness} />

                            </div>
                        </div>
                        <div className="backgrounds">
                            {backgroundList.map((v, i) => PreviewBackground(v, backgroundPreviewList[i]?.[0]))}
                        </div>
                    </div>
                </>,
                configElement,
            )}
        </>
    );
}

plugin.onConfig(() => {
    return configElement;
});
