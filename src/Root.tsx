import React from "react";
import { Composition, Folder } from "remotion";
import { VideoComposition } from "./VideoComposition";
import { VIDEOS, VideoData } from "./video-data";

const Wrapper: React.FC<{ data: VideoData }> = ({ data }) => <VideoComposition data={data} />;

export const RemotionRoot: React.FC = () => {
  const general = VIDEOS.find((v) => v.id === "00-general")!;
  const processes = VIDEOS.filter((v) => v.id !== "00-general");

  return (
    <>
      <Composition
        id={general.id}
        component={Wrapper}
        defaultProps={{ data: general }}
        durationInFrames={general.totalFrames}
        fps={general.fps}
        width={1080}
        height={1920}
      />

      <Folder name="Procesos">
        {processes.map((video) => (
          <Composition
            key={video.id}
            id={video.id}
            component={Wrapper}
            defaultProps={{ data: video }}
            durationInFrames={video.totalFrames}
            fps={video.fps}
            width={1080}
            height={1920}
          />
        ))}
      </Folder>
    </>
  );
};
