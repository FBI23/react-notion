import * as React from "react";
import Asset from "./components/asset";
import Code from "./components/code";
import { BlockType, ContentValueType, DecorationType } from "./types";

export const renderChildText = (properties: DecorationType[]) => {
  return properties.map(([text, decorations], i) => {
    if (!decorations) {
      return <React.Fragment key={i}>{text}</React.Fragment>;
    }

    return decorations.reduceRight((element, decorator) => {
      switch (decorator[0]) {
        case "h":
          return (
            <span key={i} className={`yat-${decorator[1]}`}>
              {element}
            </span>
          );
        case "c":
          return (
            <code key={i} className="yat-inline-code">
              {element}
            </code>
          );
        case "b":
          return <b key={i}>{element}</b>;
        case "i":
          return <em key={i}>{element}</em>;
        case "s":
          return <s key={i}>{element}</s>;
        case "a":
          return (
            <a className="yat-link" href={decorator[1]} key={i}>
              {element}
            </a>
          );

        default:
          return <React.Fragment key={i}>{element}</React.Fragment>;
      }
    }, <>{text}</>);
  });
};

interface Block {
  block: BlockType;
  parentBlock: BlockType;
  level: number;
}

export const Block: React.FC<Block> = props => {
  const { block, parentBlock, children } = props;
  const blockValue = block?.value;
  switch (blockValue.type) {
    case "page":
      return <div className="yat">{children}</div>;
    case "header":
      if (!blockValue.properties) return null;
      return (
        <h1 className="yat-h1">
          {renderChildText(blockValue.properties.title)}
        </h1>
      );
    case "sub_header":
      if (!blockValue.properties) return null;
      return (
        <h2 className="yat-h2">
          {renderChildText(blockValue.properties.title)}
        </h2>
      );
    case "sub_sub_header":
      if (!blockValue.properties) return null;
      return (
        <h3 className="yat-h3">
          {renderChildText(blockValue.properties.title)}
        </h3>
      );
    case "divider":
      return <hr className="yat-hr" />;
    case "text":
      if (!blockValue.properties) {
        return <p style={{ height: "1rem" }}> </p>;
      }
      return (
        <p className={`yat-text`}>
          {renderChildText(blockValue.properties.title)}
        </p>
      );
    case "bulleted_list":
    case "numbered_list":
      const isTopLevel = block.value.type !== parentBlock.value.type;

      const wrapList = (content: React.ReactNode) =>
        blockValue.type === "bulleted_list" ? (
          <ul className="yat-list yat-list-disc">{content}</ul>
        ) : (
          <ol className="yat-list yat-list-numbered">{content}</ol>
        );

      let output: JSX.Element | null = null;

      if (blockValue.content) {
        output = (
          <>
            {blockValue.properties && (
              <li>{renderChildText(blockValue.properties.title)}</li>
            )}
            {wrapList(children)}
          </>
        );
      } else {
        output = blockValue.properties ? (
          <li>{renderChildText(blockValue.properties.title)}</li>
        ) : null;
      }

      return isTopLevel ? wrapList(output) : output;

    case "image":
    case "embed":
    case "video":
      const value = block.value as ContentValueType;

      return (
        <figure
          className="yat-asset-wrapper"
          style={{ width: value?.format?.block_width }}
        >
          <Asset block={block} />
          {value.properties.caption && (
            <figcaption className="yat-image-caption">
              {renderChildText(value.properties.caption)}
            </figcaption>
          )}
        </figure>
      );
    case "code": {
      if (blockValue.properties.title) {
        const content = blockValue.properties.title[0][0];
        const language = blockValue.properties.language[0][0];
        return <Code key={blockValue.id} language={language} code={content} />;
      }
      break;
    }
    case "column_list":
      return <div className="yat-row">{children}</div>;
    case "column":
      const spacerWith = 46;
      const ratio = blockValue.format.column_ratio;
      const columns = Number((1 / ratio).toFixed(0));
      const spacerTotalWith = (columns - 1) * spacerWith;
      const width = `calc((100% - ${spacerTotalWith}px) * ${ratio})`;
      return (
        <>
          <div className="yat-column" style={{ width }}>
            {children}
          </div>
          <div className="yat-spacer" style={{ width: spacerWith }} />
        </>
      );
    case "quote":
      if (!blockValue.properties) return null;
      return (
        <blockquote className="yat-quote">
          {renderChildText(blockValue.properties.title)}
        </blockquote>
      );
    case "callout":
      return (
        <div className={`yat-callout yat-${blockValue.format.block_color}_co`}>
          <div>{blockValue.format.page_icon}</div>
          <div className="yat-callout-text">
            {renderChildText(blockValue.properties.title)}
          </div>
        </div>
      );
    default:
      if (process.env.NODE_ENV !== "production") {
        console.log("Unsupported type " + block?.value?.type);
      }
      return <div />;
  }
  return null;
};
