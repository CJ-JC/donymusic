import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Editor = ({ name, value, onChange }) => {
  const handleEditorChange = (content) => {
    onChange({ target: { name, value: content } });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
    ],
  };

  return (
    <ReactQuill value={value} onChange={handleEditorChange} modules={modules} />
  );
};

export default Editor;
