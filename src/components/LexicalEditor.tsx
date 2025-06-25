"use client";
import React, { useEffect } from "react";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getRoot, EditorState, $createParagraphNode, $createTextNode } from "lexical";
import { KEY_ENTER_COMMAND } from "lexical";
import classes from "./LexicalEditor.module.css";
import { Box } from "@mantine/core";

interface LexicalEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
}

// Plugin to handle Enter key and value synchronization
function EditorSyncPlugin({ value, onEnter }: { value: string; onEnter?: () => void }) {
  const [editor] = useLexicalComposerContext();

  // Handle Enter key
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (event instanceof KeyboardEvent && !event.shiftKey) {
          event.preventDefault();
          onEnter?.();
          return true;
        }
        return false;
      },
      1
    );
  }, [editor, onEnter]);

  // Sync editor content with prop value
  useEffect(() => {
    const currentContent = editor.getEditorState().read(() => $getRoot().getTextContent());
    if (currentContent !== value) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        if (value.trim()) {
          const paragraph = $createParagraphNode();
          const textNode = $createTextNode(value);
          paragraph.append(textNode);
          root.append(paragraph);
        }
      });
    }
  }, [editor, value]);

  return null;
}

const LexicalEditor: React.FC<LexicalEditorProps> = ({
  value = "",
  onChange,
  onEnter,
  placeholder = "Bạn muốn biết gì?"
}) => {
  const editorConfig: InitialConfigType = {
    namespace: "ChatInputEditor",
    onError(error: Error) {
      console.error(error);
      throw error;
    },
    theme: {
      paragraph: classes.paragraph,
    },
  };

  const handleOnChange = (editorState: EditorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();
      onChange?.(textContent);
    });
  };

  return (
    <LexicalComposer initialConfig={editorConfig}>
      <Box className={classes.container}>
        <PlainTextPlugin
          contentEditable={
            <ContentEditable
              className={classes.editor}
              aria-placeholder={placeholder}
              placeholder={
                <div className={classes.placeholder}>
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin onChange={handleOnChange} />
        <AutoFocusPlugin />
        <EditorSyncPlugin value={value} onEnter={onEnter} />
      </Box>
    </LexicalComposer>
  );
};

export default LexicalEditor;