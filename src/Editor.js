import React from "react";
import CodeEditor from "react-simple-code-editor";
import { Scrollbars } from "react-custom-scrollbars";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-markdown";
import "./Editor.css";

const Editor = ({ code = "", onValueChange, height = 350 }) => {
  return (
    <Scrollbars style={{ height }}>
      <CodeEditor
        value={code}
        onValueChange={onValueChange}
        highlight={code => highlight(code, languages.markdown)}
        padding={10}
        className="react-simple-code-editor"
      />
    </Scrollbars>
  );
};

export default Editor;
