import React from "react";
import { Block } from "./block";
import { BlockMapType } from "./types";

interface NotionRendererProps {
  blockMap: BlockMapType;
  currentId?: string;
  level?: number;
  children?: React.ReactChild;
}

export const NotionRenderer: React.FC<NotionRendererProps> = ({
  level = 0,
  currentId,
  blockMap,
  children
}) => {
  const id = currentId || Object.keys(blockMap)[0];
  const currentBlock = blockMap[id];
  const parentBlock = blockMap[currentBlock.value.parent_id];

  return (
    <React.Fragment>
      <Block
        key={id}
        level={level}
        block={currentBlock}
        parentBlock={parentBlock}
      >
        {children}
        {currentBlock?.value?.content?.map(contentId => (
          <NotionRenderer
            key={contentId}
            currentId={contentId}
            blockMap={blockMap}
            level={level + 1}
          />
        ))}
      </Block>
    </React.Fragment>
  );
};
