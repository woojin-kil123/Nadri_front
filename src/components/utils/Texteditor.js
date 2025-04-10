import { colors } from "@mui/material";
import axios from "axios";
import ImageResize from "quill-image-resize-module-react";
import { useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";

Quill.register("modules/ImageResize", ImageResize);
const TextEditor = (props) => {
  const data = props.data;
  const setData = props.setData;
  const editorRef = useRef(null);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
        ],
      },
    };
  }, []);
  return (
    <ReactQuill
      ref={editorRef}
      value={data}
      onChange={setData}
      theme="snow"
      modules={modules}
    />
  );
};
export default TextEditor;
