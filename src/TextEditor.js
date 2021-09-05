import React from "react";
import Quill from "quill";
import { useCallback, useEffect } from "react";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";

var toolbarOptions = [
  ["bold", "italic", "underline"], // toggled buttons
  ["code-block"],
  [{ list: "bullet" }],
  [{ header: [1, 2, 3] }],
  [{ color: [] }, { background: ["0000000"] }], // dropdown with defaults from theme
];

export default function TextEditor() {
  useEffect(() => {
    const socket = io("http://localhost:3001");
    return () => {
      socket.disconnect();
    };
  }, []);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    new Quill(editor, { theme: "snow", modules: { toolbar: toolbarOptions } });
    //
  }, []);
  return (
    <div className="container" ref={wrapperRef}>
      Text Editor
    </div>
  );
}
