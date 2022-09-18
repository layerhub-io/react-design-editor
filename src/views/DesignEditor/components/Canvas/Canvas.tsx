import React from "react"
import { Canvas } from "@layerhub-io/react"
import Playback from "../Playback"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import ContextMenu from "../ContextMenu"

export default function () {
  const { displayPlayback } = useDesignEditorContext()
  return (
    <div style={{ flex: 1, display: "flex", position: "relative" }}>
      {displayPlayback && <Playback />}
      <ContextMenu />
      <Canvas
        config={{
          background: "#f1f2f6",
          controlsPosition: {
            rotation: "BOTTOM",
          },
          shadow: {
            blur: 4,
            color: "#fcfcfc",
            offsetX: 0,
            offsetY: 0,
          },
        }}
      />
    </div>
  )
}
