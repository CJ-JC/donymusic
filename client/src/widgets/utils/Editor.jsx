import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = ({ name, value, onChange }) => {
  const handleEditorChange = (content) => {
    onChange({ target: { name, value: content } });
  };

  return <ReactQuill value={value} onChange={handleEditorChange} />;
};

export default Editor;
