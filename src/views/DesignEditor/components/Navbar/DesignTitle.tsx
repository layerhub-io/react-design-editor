import React from "react"
import { Input } from "baseui/input"
import { Block } from "baseui/block"
import CloudCheck from "~/components/Icons/CloudCheck"
import { StatefulTooltip } from "baseui/tooltip"

interface State {
  name: string
  width: number
}

export default function () {
  const [state, setState] = React.useState<State>({ name: "My first design.", width: 0 })
  const inputTitleRef = React.useRef<Input>(null)
  const spanRef = React.useRef<HTMLDivElement | null>(null)

  const handleInputChange = (name: string) => {
    setState({ ...state, name: name, width: spanRef.current?.clientWidth! })
  }

  React.useEffect(() => {
    setState({ ...state, width: spanRef.current?.clientWidth! + 20 })
  }, [state.name])

  return (
    <Block
      $style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        opacity: 1,
      }}
    >
      <Block $style={{ display: "flex", position: "absolute", top: "-10px", left: "50%", width: "100%" }}>
        <Block
          $style={{
            fontFamily: "Uber Move Text",
            position: "absolute",
            top: "-10px",
            left: "50%",
            fontSize: "14px",
            fontWeight: 500,
          }}
          ref={spanRef}
        >
          {state.name}
        </Block>
      </Block>
      <Block width={`${state.width}px`} display={"flex"}>
        <Input
          onChange={(e: any) => handleInputChange(e.target.value)}
          overrides={{
            Root: {
              style: {
                backgroundColor: "transparent",
                borderTopStyle: "none",
                borderBottomStyle: "none",
                borderRightStyle: "none",
                borderLeftStyle: "none",
              },
            },
            InputContainer: {
              style: {
                backgroundColor: "transparent",
                paddingRight: 0,
              },
            },
            Input: {
              style: {
                fontWeight: 500,
                fontSize: "14px",
                width: `${state.width}px`,
                fontFamily: "Uber Move Text",
                backgroundColor: "transparent",
                color: "#ffffff",
                paddingRight: 0,
              },
            },
          }}
          value={state.name}
          ref={inputTitleRef}
        />
      </Block>

      <StatefulTooltip
        showArrow={true}
        overrides={{
          Inner: {
            style: {
              backgroundColor: "#ffffff",
            },
          },
        }}
        content={() => <Block backgroundColor={"#ffffff"}>{"All changes are saved"}</Block>}
      >
        <Block
          $style={{
            cursor: "pointer",
            padding: "10px",
            display: "flex",
            color: "#ffffff",
          }}
        >
          <CloudCheck size={24} />
        </Block>
      </StatefulTooltip>
    </Block>
  )
}
