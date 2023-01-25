import { BaseBackground } from "./background/background";
import { CoverImageBackground } from "./background/coverImageBackground";
import { CSSBackground } from "./background/cssBackground";
import { ImageBackground } from "./background/imageBackground";
import { MaskedBackground } from "./background/maskedBackground";
import { RandomBackground } from "./background/randomBackground";
import { RemoteImageBackground } from "./background/remoteImageBackground";
import { RemoteRandImageBackgroundLoli } from "./background/remoteRandImageBackgroundLoli";
import { RemoteRandImageBackgroundScenery } from "./background/remoteRandImageBackgroundScenery";
import { VideoBackground } from "./background/videoBackground";
import { useLocalStorage } from "./hooks";

export const BackgroundTypes = [VideoBackground, CSSBackground, ImageBackground, RemoteRandImageBackgroundLoli, RemoteRandImageBackgroundScenery, CoverImageBackground, RandomBackground, RemoteImageBackground, MaskedBackground];

export function useLocalStorageBackgroundList(key: string) {
    return useLocalStorage<
        BaseBackground[]
    >(
        key,
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
}