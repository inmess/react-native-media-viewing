/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { ComponentType } from "react";
import { ModalProps } from "react-native";
import { MediaSource } from "./@types";
declare type Props = {
    media: MediaSource[];
    keyExtractor?: (mediaSrc: MediaSource, index: number) => string;
    imageIndex: number;
    visible: boolean;
    onRequestClose: () => void;
    onLongPress?: (image: MediaSource) => void;
    onImageIndexChange?: (imageIndex: number) => void;
    presentationStyle?: ModalProps["presentationStyle"];
    animationType?: ModalProps["animationType"];
    backgroundColor?: string;
    swipeToCloseEnabled?: boolean;
    doubleTapToZoomEnabled?: boolean;
    delayLongPress?: number;
    HeaderComponent?: ComponentType<{
        imageIndex: number;
    }>;
    FooterComponent?: ComponentType<{
        imageIndex: number;
    }>;
};
declare const EnhancedMediaViewing: (props: Props) => JSX.Element;
export default EnhancedMediaViewing;
