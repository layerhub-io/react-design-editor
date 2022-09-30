import React from "react"
import { useActiveObject, useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { Button, SIZE, KIND } from "baseui/button"
import { PLACEMENT, StatefulPopover } from "baseui/popover"
import { StatefulTooltip } from "baseui/tooltip"
import FlipHorizontal from "~/components/Icons/FlipHorizontal"
import FlipVertical from "~/components/Icons/FlipVertical"

const Flip = () => {
  const editor = useEditor()
  const activeObject = useActiveObject() as any
  const [state, setState] = React.useState({ flipX: false, flipY: false })

  React.useEffect(() => {
    if (activeObject) {
      setState({
        flipX: activeObject.flipX,
        flipY: activeObject.flipY,
      })
    }
  }, [activeObject])

  const flipHorizontally = React.useCallback(() => {
    editor.objects.update({ flipX: !state.flipX })
    setState({ ...state, flipX: !state.flipX })
  }, [editor, state])

  const flipVertically = React.useCallback(() => {
    editor.objects.update({ flipY: !state.flipY })
    setState({ ...state, flipY: !state.flipY })
  }, [editor, state])

  return (
    <StatefulPopover
      placement={PLACEMENT.bottom}
      content={() => (
        <Block width="180px" padding="12px" backgroundColor="#ffffff">
          <Block>
            <Button
              $style={{ width: "100%", justifyContent: "flex-start" }}
              startEnhancer={<FlipHorizontal size={24} />}
              onClick={flipHorizontally}
              kind={KIND.tertiary}
              size={SIZE.mini}
            >
              Flip horizontally
            </Button>
          </Block>
          <Button
            $style={{ width: "100%", justifyContent: "flex-start" }}
            startEnhancer={<FlipVertical size={24} />}
            onClick={flipVertically}
            kind={KIND.tertiary}
            size={SIZE.mini}
          >
            Flip vertically
          </Button>
        </Block>
      )}
    >
      <Block>
        <StatefulTooltip placement={PLACEMENT.bottom} showArrow={true} accessibilityType="tooltip" content="Layers">
          <Button size={SIZE.compact} kind={KIND.tertiary}>
            Flip
          </Button>
        </StatefulTooltip>
      </Block>
    </StatefulPopover>
  )
}

export default Flip
