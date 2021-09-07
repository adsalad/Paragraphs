import React from "react";
import Quill from "quill";
import { useCallback, useEffect, useState } from "react";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

var toolbarOptions = [
  ["bold", "italic", "underline"], // toggled buttons
  ["code-block"],
  [{ list: "bullet" }],
  [{ header: [1, 2, 3] }],
  [{ color: [] }, { background: ["0000000"] }], // dropdown with defaults from theme
];

export default function TextEditor() {
  const SAVE_INTERVAL_MS = 2000;
  const { id: documentId } = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

  //connect socket
  useEffect(() => {
    const s = io("http://localhost:3001");
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  //loads document info when user opens specific pre-existing document 
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  // 1. if a text change is made, notify the server
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  //2. updates content of text editor for all clients when change is made on one client 
  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  //save to mongoDB every interval
  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  
  //initialize quill and disable the text editor until it loads up 
  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;
    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const qu = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });
    qu.disable();
    qu.setText("Loading...");
    setQuill(qu);
  }, []);
  return (
    <div className="container" ref={wrapperRef}>
      Text Editor
    </div>
  );
}