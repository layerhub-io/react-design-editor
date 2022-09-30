import React from "react"
import { Checkbox } from "baseui/checkbox"
import { StatefulPopover, PLACEMENT } from "baseui/popover"
import { HexColorPicker } from "react-colorful"
import { Slider } from "baseui/slider"
import { Input } from "baseui/input"
import { useActiveObject, useEditor } from "@layerhub-io/react"

interface Options {
  enabled: boolean
  offsetX: number
  offsetY: number
  blur: number
  color: string
}

const Shadow = () => {
  const editor = useEditor()
  const [options, setOptions] = React.useState<Options>({
    enabled: false,
    offsetX: 15,
    offsetY: 15,
    blur: 25,
    color: "rgba(0,0,0,0.45)",
  })

  const activeObject = useActiveObject()

  React.useEffect(() => {
    if (activeObject) {
      updateOptions(activeObject)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeObject])

  const updateOptions = (object: any) => {
    if (object.shadow) {
      const { blur, color, enabled, offsetX, offsetY } = object.shadow
      setOptions({ ...options, blur, color, enabled, offsetX, offsetY })
      //   if (enabled) {
      //     setOpenItems([0])
      //   }
    }
  }
  const handleChange = (key: string, value: any) => {
    setOptions({ ...options, [key]: value })
    if (editor) {
      console.log({ ...options, [key]: value })
      editor.objects.setShadow({ ...options, [key]: value })
    }
  }

  return (
    <div style={{ padding: "0 1.5rem" }}>
      <div
        style={{
          margin: "1rem 0 0.5rem",
          fontSize: "14px",
          background: "rgba(0,0,0,0.05)",
          padding: "10px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.2rem" }}>
          <Checkbox
            checked={options.enabled}
            // @ts-ignore
            onChange={(e) => handleChange("enabled", e.target.checked)}
          />
          Shadow
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
              <HexColorPicker onChange={(color) => handleChange("color", color)} />
              <Input
                overrides={{ Input: { style: { textAlign: "center" } } }}
                value={options.color}
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
                backgroundColor: options.color,
              }}
            />
          </div>
        </StatefulPopover>
      </div>

      <div style={{ height: "10px" }} />

      <div style={{ padding: "0 8px" }}>
        <div>
          <div style={{ fontSize: "14px" }}>Blur</div>
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
            value={[options.blur]}
            onChange={({ value }) => handleChange("blur", value)}
          />
        </div>
      </div>

      <div>
        <div style={{ height: "10px" }} />
        <div style={{ padding: "0 8px" }}>
          <div style={{ fontSize: "14px" }}>Offset Y</div>
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
            value={[options.offsetY]}
            onChange={({ value }) => handleChange("offsetY", value)}
          />
        </div>
        <div style={{ padding: "0 8px" }}>
          <div>
            <div style={{ fontSize: "14px" }}>Offset X</div>
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
              value={[options.offsetX]}
              onChange={({ value }) => handleChange("offsetX", value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Shadow
