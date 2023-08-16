import React from "react";
import { MediaSource } from "../../@types";
declare type Props = {
    mediaSrc: MediaSource;
    onRequestClose: () => void;
    onZoom: (isZoomed: boolean) => void;
    onLongPress: (image: MediaSource) => void;
    delayLongPress: number;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
};
declare const _default: React.MemoExoticComponent<({ mediaSrc, onZoom, onRequestClose, onLongPress, delayLongPress, swipeToCloseEnabled, doubleTapToZoomEnabled, }: Props) => JSX.Element>;
export default _default;
