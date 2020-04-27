import { highlight, languages } from "prismjs";
import "prismjs/components/prism-jsx";
import * as React from "react";

const Code: React.FC<{ code: string; language: string }> = ({
  code,
  language = "javascript"
}) => {
  const prismLanguage =
    languages[language.toLowerCase()] || languages.javascript;

  return (
    <pre>
      <code
        className="yat-code"
        dangerouslySetInnerHTML={{
          __html: highlight(code, prismLanguage, language.toLowerCase())
        }}
      />
    </pre>
  );
};

export default Code;
