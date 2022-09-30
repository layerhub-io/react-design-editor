import React from "react"
import { Block } from "baseui/block"
import Common from "./Common"
import useAppContext from "~/hooks/useAppContext"
import { useActiveObject, useEditor } from "@layerhub-io/react"

const Canvas = () => {
  const [state, setState] = React.useState({ fill: "#000000" })
  const { setActiveSubMenu } = useAppContext()
  const editor = useEditor()
  const activeObject = useActiveObject() as any

  React.useEffect(() => {
    if (editor) {
      setState({ fill: editor.canvas.backgroundColor as string })
    }
  }, [editor])

  React.useEffect(() => {
    let watcher = async () => {
      setState({ fill: editor.canvas.backgroundColor as string })
    }
    if (editor) {
      editor.on("canvas:updated", watcher)
    }
    return () => {
      if (editor) {
        editor.off("canvas:updated", watcher)
      }
    }
  }, [editor, activeObject])

  return (
    <Block
      $style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        justifyContent: "space-between",
      }}
    >
      <Block
        $style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Block onClick={() => setActiveSubMenu("CanvasFill")}>
          <Block
            $style={{
              height: "24px",
              width: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              backgroundColor: state.fill,
              border: "1px solid #dedede",
            }}
          />
        </Block>
      </Block>
    </Block>
  )
}

export default Canvas
