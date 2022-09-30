import React from "react"
import { useTimer } from "@layerhub-io/use-timer"
import { Block } from "baseui/block"
import Pause from "~/components/Icons/Pause"
import PlaySolid from "~/components/Icons/PlaySolid"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"

const TimelineControl = () => {
  const { pause, status } = useTimer()
  const { setDisplayPlayback } = useDesignEditorContext()

  return (
    <Block id="EditorPlayControl" $style={{ padding: "0 1rem" }}>
      <Block
        onClick={
          status === "STOPPED" || status === "PAUSED"
            ? () => {
                setDisplayPlayback(true)
              }
            : () => {
                pause()
                setDisplayPlayback(false)
              }
        }
        $style={{
          height: "56px",
          width: "56px",
          background: "#ffffff",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 0 1px rgba(64,87,109,0.07),0 2px 12px rgba(53,71,90,0.2)",
        }}
      >
        {status === "STOPPED" || status === "PAUSED" ? <PlaySolid size={24} /> : <Pause size={24} />}
      </Block>
    </Block>
  )
}

export default TimelineControl
