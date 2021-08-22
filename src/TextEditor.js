import React from "react";
import Quill from "quill";
import { useEffect } from "react";
import "quill/dist/quill.snow.css";

export default function TextEditor() {
  useEffect(() => { 
    new Quill('#container', {theme: "snow"})

  }, [])
  return <div id ="container">Text Editor</div>;
}
