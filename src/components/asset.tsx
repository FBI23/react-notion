import * as React from "react";
import { BlockType, ContentValueType } from "../types";

const types = ["video", "image", "embed"];

const Asset: React.FC<{ block: BlockType }> = ({ block }) => {
  const value = block.value as ContentValueType;
  const type = block.value.type;

  if (!types.includes(type)) {
    return null;
  }

  const format = value.format;

  if (!format) {
    return null;
  }

  const {
    display_source,
    block_aspect_ratio,
    block_height,
    block_width
  } = format;

  const aspectRatio = block_aspect_ratio || block_height / block_width;

  if (type === "embed" || type === "video") {
    return (
      <div
        style={{
          paddingBottom: `${aspectRatio * 100}%`,
          position: "relative"
        }}
      >
        <iframe className="yat-image-inset" src={display_source} />
      </div>
    );
  }

  const src = `https://notion.so/image/${encodeURIComponent(
    value.properties.source[0][0]
  )}`;

  if (type === "image") {
    const caption = value.properties.caption?.[0][0];
    if (block_aspect_ratio) {
      return (
        <div
          style={{
            paddingBottom: `${aspectRatio * 100}%`,
            position: "relative"
          }}
        >
          <img className="yat-image-inset" alt={caption} src={src} />
        </div>
      );
    } else {
      return <img alt={caption} src={src} />;
    }
  }

  return null;
};

export default Asset;
