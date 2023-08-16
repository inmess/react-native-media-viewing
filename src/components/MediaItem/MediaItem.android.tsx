import React, { useCallback, useRef, useState } from "react";
import VideoPlayer from "react-native-video-controls";
import {
  Animated,
  ScrollView,
  Dimensions,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
  NativeMethodsMixin,
} from "react-native";

import useImageDimensions from "../../hooks/useImageDimensions";
import usePanResponder from "../../hooks/usePanResponder";

import { getImageStyles, getImageTransform } from "../../utils";
import { MediaSource } from "../../@types";
import { MediaLoading } from "./MediaLoading";

const SWIPE_CLOSE_OFFSET = 75;
const SWIPE_CLOSE_VELOCITY = 1.75;
const SCREEN = Dimensions.get("window");
const SCREEN_WIDTH = SCREEN.width;
const SCREEN_HEIGHT = SCREEN.height;

type Props = {
  mediaSrc: MediaSource;
  onRequestClose: () => void;
  onZoom: (isZoomed: boolean) => void;
  onLongPress: (image: MediaSource) => void;
  delayLongPress: number;
  swipeToCloseEnabled?: boolean;
  doubleTapToZoomEnabled?: boolean;
};

const MediaItem = ({
  mediaSrc,
  onZoom,
  onRequestClose,
  onLongPress,
  delayLongPress,
  swipeToCloseEnabled = true,
  doubleTapToZoomEnabled = true,
}: Props) => {
  const imageContainer = useRef<ScrollView & NativeMethodsMixin>(null);
  const imageDimensions = useImageDimensions(mediaSrc);
  const [translate, scale] = getImageTransform(imageDimensions, SCREEN);
  const scrollValueY = new Animated.Value(0);
  const [isLoaded, setLoadEnd] = useState(false);

  const onLoaded = useCallback(() => setLoadEnd(true), []);
  const onZoomPerformed = useCallback(
    (isZoomed: boolean) => {
      onZoom(isZoomed);
      if (imageContainer?.current) {
        imageContainer.current.setNativeProps({
          scrollEnabled: !isZoomed,
        });
      }
    },
    [imageContainer]
  );

  const onLongPressHandler = useCallback(() => {
    onLongPress(mediaSrc);
  }, [mediaSrc, onLongPress]);

  const [panHandlers, scaleValue, translateValue] = usePanResponder({
    initialScale: scale || 1,
    initialTranslate: translate || { x: 0, y: 0 },
    onZoom: onZoomPerformed,
    doubleTapToZoomEnabled,
    onLongPress: onLongPressHandler,
    delayLongPress,
  });

  const imagesStyles = getImageStyles(
    imageDimensions,
    translateValue,
    scaleValue
  );
  const imageOpacity = scrollValueY.interpolate({
    inputRange: [-SWIPE_CLOSE_OFFSET, 0, SWIPE_CLOSE_OFFSET],
    outputRange: [0.7, 1, 0.7],
  });
  const imageStylesWithOpacity = { ...imagesStyles, opacity: imageOpacity };

  const onScrollEndDrag = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocityY = nativeEvent?.velocity?.y ?? 0;
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    if (
      (Math.abs(velocityY) > SWIPE_CLOSE_VELOCITY &&
        offsetY > SWIPE_CLOSE_OFFSET) ||
      offsetY > SCREEN_HEIGHT / 2
    ) {
      onRequestClose();
    }
  };

  const onScroll = ({
    nativeEvent,
  }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent?.contentOffset?.y ?? 0;

    scrollValueY.setValue(offsetY);
  };

  return (
    <ScrollView
      ref={imageContainer}
      style={styles.listItem}
      pagingEnabled
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.imageScrollContainer}
      scrollEnabled={swipeToCloseEnabled}
      {...(swipeToCloseEnabled && {
        onScroll,
        onScrollEndDrag,
      })}
    >
      {mediaSrc.mediaType === "image" && (
        <Animated.Image
          {...panHandlers}
          source={mediaSrc}
          style={imageStylesWithOpacity}
          onLoad={onLoaded}
        />
      )}
      {mediaSrc.mediaType === "video" && (
        <VideoPlayer
          source={mediaSrc}
          navigator={null}
          disableBack
          disableVolume
          disableFullscreen
          style={styles.containerMedia}
          onLoad={onLoaded}
          paused={false}
        />
      )}
      {(!isLoaded || !imageDimensions) && <MediaLoading />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  imageScrollContainer: {
    // height: SCREEN_HEIGHT * 2,
    height: '90%',
  },
  containerMedia: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
});

export default React.memo(MediaItem);
