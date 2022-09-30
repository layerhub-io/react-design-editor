import React from "react"
import { Checkbox } from "baseui/checkbox"
import { StatefulPopover, PLACEMENT } from "baseui/popover"
import { HexColorPicker } from "react-colorful"
import { Slider } from "baseui/slider"
import { Input } from "baseui/input"
import { useActiveObject, useEditor } from "@layerhub-io/react"

interface Options {
  enabled: boolean
  stroke: string
  strokeWidth: number
}

const Outline = () => {
  const editor = useEditor()
  const activeObject = useActiveObject()

  const [options, setOptions] = React.useState<Options>({
    enabled: true,
    stroke: "#000000",
    strokeWidth: 1,
  })

  React.useEffect(() => {
    if (activeObject) {
      updateOptions(activeObject)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject])

  const updateOptions = (object: any) => {
    const { stroke, strokeWidth } = object
    setOptions({ ...options, stroke, strokeWidth, enabled: !!strokeWidth })
  }

  const handleChange = (type: string, value: any) => {
    setOptions({ ...options, [type]: value })
    if (type === "enabled") {
      if (value) {
        editor.objects.update(options)
      } else {
        editor.objects.update({ strokeWidth: 0 })
      }
    } else {
      if (editor && options.enabled) {
      editor.objects.update({ [type]: value })
      }
    }
  }

  return (
    <div style={{ padding: "2rem 2rem 0" }}>
      <div>
        <div
          style={{
            margin: "0 0 0.5rem",
            fontSize: "14px",
            background: "rgba(0,0,0,0.05)",
            padding: "10px 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Checkbox checked={options.enabled} onChange={(e) => handleChange("enabled", (e.target as any).checked)} />
            Outline
          </div>
          <StatefulPopover
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
                <HexColorPicker onChange={(color) => handleChange("stroke", color)} />
                <Input
                  overrides={{ Input: { style: { textAlign: "center" } } }}
                  value={options.stroke}
                  onChange={(e) => handleChange("color", (e.target as any).value)}
                  placeholder="#000000"
                  clearOnEscape
                />
              </div>
            }
            accessibilityType="tooltip"
          >
            <div>
              <div
                style={{
                  height: "28px",
                  width: "28px",
                  backgroundSize: "100% 100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  backgroundColor: options.stroke,
                }}
              />
            </div>
          </StatefulPopover>
        </div>
      </div>
      <div style={{ height: "10px" }} />

      <div style={{ padding: "0 8px" }}>
        <div>
          <div style={{ fontSize: "14px" }}>Size</div>
          <Slider
            overrides={{
              InnerThumb: () => null,
              ThumbValue: () => null,
              TickBar: () => null,
              Thumb: {
                style: {
                  height: "12px",
                  width: "12px",
                  paddingLeft: 0,
                },
              },
              Track: {
                style: {
                  paddingLeft: 0,
                  paddingRight: 0,
                },
              },
            }}
            value={[options.strokeWidth]}
            onChange={({ value }) => handleChange("strokeWidth", value[0])}
          />
        </div>
      </div>
    </div>
  )
}

export default Outline
