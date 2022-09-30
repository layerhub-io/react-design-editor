import React from "react"
import { Block } from "baseui/block"
import { HexColorPicker } from "react-colorful"
import Common from "./Common"
import { useActiveObject } from "@layerhub-io/react"
import { groupBy } from "lodash"
import { PLACEMENT, StatefulPopover } from "baseui/popover"
import Flip from "./Shared/Flip"

const Vector = () => {
  const [state, setState] = React.useState<any>({ colors: [], colorMap: {} })
  const vectorPaths = React.useRef<any>({})
  const activeObject = useActiveObject() as any

  React.useEffect(() => {
    if (activeObject && activeObject.type === "StaticVector") {
      const objects = activeObject._objects[0]._objects
      const objectColors = groupBy(objects, "fill")
      vectorPaths.current = objectColors
      setState({ ...state, colors: Object.keys(objectColors), colorMap: activeObject.colorMap })
    }
  }, [activeObject])

  const changeBackgroundColor = (prev: string, next: string) => {
    const objectRef = activeObject
    objectRef.updateLayerColor(prev, next)
    setState({
      ...state,
      colorMap: {
        ...state.colorMap,
        [prev]: next,
      },
    })
  }

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
      <Block>
        <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Block $style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {Object.keys(state.colorMap).map((c, index) => {
              return (
                <StatefulPopover
                  key={index}
                  placement={PLACEMENT.bottomLeft}
                  content={
                    <div
                      style={{
                        padding: "1rem",
                        background: "#ffffff",
                        width: "200px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        textAlign: "center",
                      }}
                    >
                      <HexColorPicker
                        onChange={(color) => {
                          changeBackgroundColor(c, color)
                        }}
                      />
                    </div>
                  }
                  accessibilityType="tooltip"
                >
                  <div>
                    <div
                      style={{
                        height: "24px",
                        width: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        backgroundColor: state.colorMap[c],
                        border: "1px solid #dedede",
                      }}
                    />
                  </div>
                </StatefulPopover>
              )
            })}
          </Block>
          <Flip />
        </Block>
      </Block>
      <Common />
    </Block>
  )
}

export default Vector
