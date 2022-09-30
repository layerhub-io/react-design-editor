import React from "react"
import { Block } from "baseui/block"
import Common from "./Common"
import Flip from "./Shared/Flip"
import useAppContext from "~/hooks/useAppContext"
import { useActiveObject, useEditor } from "@layerhub-io/react"

const Path = () => {
  const [state, setState] = React.useState({ fill: "#000000" })
  const { setActiveSubMenu } = useAppContext()
  const editor = useEditor()
  const activeObject = useActiveObject() as any

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticPath") {
      setState({ fill: activeObject.fill })
    }
  }, [activeObject])

  React.useEffect(() => {
    let watcher = async () => {
      if (activeObject && activeObject.type === "StaticPath") {
        setState({ fill: activeObject.fill })
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
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
        <Block onClick={() => setActiveSubMenu("PathFill")}>
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
        <Flip />
      </Block>
      <Common />
    </Block>
  )
}

export default Path
