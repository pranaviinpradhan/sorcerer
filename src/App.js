import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  convertFromRaw,
  convertToRaw,
  RichUtils,
} from "draft-js";
import { Center } from "@chakra-ui/react";
import "./App.css";
import { useScreenDetector } from "./useScreenDetector";

const TextEditor = () => {
  const { isMobile, isTablet, isDesktop } = useScreenDetector();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [formattedContent, setFormattedContent] = useState("");

  useEffect(() => {
    // Load content from local storage on page refresh
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      const contentState = convertFromRaw(JSON.parse(savedContent));
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, []);
  console.log(editorState.getCurrentContent().getPlainText(), "editor state");

  const handleSave = () => {
    // Save content to local storage
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    localStorage.setItem("editorContent", JSON.stringify(rawContentState));
  };

  const handleEditorChange = (newEditorState) => {
    // Check for specific formatting rules
    const contentState = newEditorState.getCurrentContent();
    const plainText = contentState.getPlainText();
    console.log(plainText, "plainText");


    if (plainText.startsWith("# ")) {
      const updatedContentState = ContentState.createFromText(
        plainText.substring(2)
      );
      const newState = EditorState.createWithContent(updatedContentState);
      setEditorState(RichUtils.toggleBlockType(newState, "header-one"));
      console.log(
        convertToRaw(editorState.getCurrentContent()),
        "current content"
      );
      return;
    }
    // Other formatting rules...
    setEditorState(newEditorState);

    // Bold format for lines starting with *
    if (plainText.startsWith("* ")) {
      const updatedContentState = ContentState.createFromText(
        plainText.substring(2)
      );
      const newState = EditorState.createWithContent(updatedContentState);
      setEditorState(RichUtils.toggleInlineStyle(newState, "BOLD"));
      console.log("bold");
      return;
    }

    // Red line for lines starting with **
    if (plainText.startsWith("** ")) {
      const updatedContentState = ContentState.createFromText(
        plainText.substring(3)
      );
      const newState = EditorState.createWithContent(updatedContentState);
      setEditorState(RichUtils.toggleInlineStyle(newState, "red-text"));
      console.log("red");
      return;
    }

    // Underline for lines starting with ***
    if (plainText.startsWith("*** ")) {
      const updatedContentState = ContentState.createFromText(
        plainText.substring(4)
      );
      const newState = EditorState.createWithContent(updatedContentState);
      setEditorState(RichUtils.toggleInlineStyle(newState, "UNDERLINE"));
      console.log("underline");
      return;
    }

    // Default behavior
    setEditorState(newEditorState);
  };
  const styleMap = {
    "red-text": {
      color: "red",
    },
  };
  return (
    <div>
      <Center
        justifyContent={"space-around"}
        marginLeft={isDesktop ? "350px" : ""}
      >
        <div>
          {isDesktop ? (
            <h2>Demo editor by Pranavi Pradhan</h2>
          ) : (
            <h5>Demo editor by Pranavi Pradhan</h5>
          )}
        </div>

        <div>
          <button onClick={handleSave} className="button">
            Save
          </button>
        </div>
      </Center>
      <div
        style={{
          border: "4px solid skyblue",
          height: isDesktop ? "600px" : "",
          margin: isDesktop ? "10px 150px" : "10px 10px",
          overflow: "scroll",
          textAlign: "left",
          padding: "10px",
        }}
      >
        <Editor
          editorState={editorState}
          onChange={handleEditorChange}
          customStyleMap={styleMap}
          placeholder="Type something..."
          style={{ textAlign: "left" }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
