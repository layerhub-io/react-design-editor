import React from "react"
import { Block } from "baseui/block"
import Scrollable from "~/components/Scrollable"
import { Delete } from "baseui/icon"
import { throttle } from "lodash"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { TEXT_EFFECTS } from "~/constants/design-editor"
import Outline from "./Common/Outline"
import Shadow from "./Common/Shadow"

const EFFECTS = {
  None: {
    fill: "#333333",
    strokeWidth: 0,
    shadow: {
      blur: 2,
      color: "#afafaf",
      offsetX: 10,
      offsetY: 10,
      enabled: false,
    },
  },
  Shadow: {
    fill: "#333333",
    shadow: {
      blur: 2,
      color: "#afafaf",
      offsetX: 10,
      offsetY: 10,
      enabled: true,
    },
  },
  Lift: {
    fill: "#333333",
    shadow: {
      blur: 25,
      color: "rgba(0,0,0,0.45)",
      offsetX: 0,
      offsetY: 0,
      enabled: true,
    },
  },
  Hollow: {
    stroke: "#000000",
    fill: null,
    strokeWidth: 2,
    shadow: {
      blur: 25,
      color: "rgba(0,0,0,0.45)",
      offsetX: 0,
      offsetY: 0,
      enabled: false,
    },
  },
  Splice: {
    stroke: "#000000",
    fill: null,
    strokeWidth: 2,
    shadow: {
      blur: 0,
      color: "#afafaf",
      offsetX: 10,
      offsetY: 10,
      enabled: true,
    },
  },
  Neon: {
    stroke: "#e84393",
    fill: "#fd79a8",
    strokeWidth: 2,
    shadow: {
      blur: 25,
      color: "#fd79a8",
      offsetX: 0,
      offsetY: 0,
      enabled: true,
    },
  },
}
const TextEffects = () => {
  const [color, setColor] = React.useState("#b32aa9")
  const activeObject = useActiveObject()
  const editor = useEditor()

  const updateObjectFill = throttle((color: string) => {
    if (activeObject) {
      editor.objects.update({ fill: color })
    }

    setColor(color)
  }, 100)

  const applyEffect = (name: string) => {
    if (editor) {
      //  @ts-ignore
      const effect = EFFECTS[name]
      if (effect) {
        editor.objects.update(effect)
      }
    }
  }
  return (
    <Block $style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Block
        $style={{
          display: "flex",
          alignItems: "center",
          fontWeight: 500,
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <Block>Effects</Block>

        <Block $style={{ cursor: "pointer", display: "flex" }}>
          <Delete size={24} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding="0 1.5rem">
          <Block $style={{ display: "grid", gridTemplateColumns: "80px 80px 80px", gap: "0.5rem" }}>
            {TEXT_EFFECTS.map((effect, index) => {
              return (
                <Block style={{ cursor: "pointer" }} key={index}>
                  <Block
                    onClick={() => applyEffect(effect.name)}
                    $style={{
                      border: "1px solid #afafaf",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "80px",
                    }}
                  >
                    <img style={{ width: "70px" }} src={effect.preview} />
                  </Block>
                  <Block
                    $style={{
                      textAlign: "center",
                      padding: "0.5rem",
                      fontSize: "14px",
                    }}
                  >
                    {effect.name}
                  </Block>
                </Block>
              )
            })}
          </Block>
          {/* <Block>
            <Outline />
            <Shadow />
          </Block> */}
        </Block>
      </Scrollable>
    </Block>
  )
}

export default TextEffects
