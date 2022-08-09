import React from "react"
import { styled } from "baseui"
import { Theme } from "baseui/theme"
import Icons from "~/components/Icons"
import { Button, KIND, SIZE } from "baseui/button"
import { useEditor, useZoomRatio } from "@scenify/react"

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  height: "50px",
  background: $theme.colors.white,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}))

interface Options {
  zoomRatio: number
}

export default function () {
  const [options, setOptions] = React.useState<Options>({
    zoomRatio: 20,
  })
  const zoomRatio: number = useZoomRatio()

  React.useEffect(() => {
    setOptions({ ...options, zoomRatio: Math.round(zoomRatio * 100) })
  }, [zoomRatio])

  return (
    <Container>
      <div>
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Layers size={20} />
        </Button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Refresh size={16} />
        </Button>
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Undo size={22} />
        </Button>
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.Redo size={22} />
        </Button>
        <Button kind={KIND.tertiary} size={SIZE.compact}>
          <Icons.TimePast size={16} />
        </Button>
      </div>
    </Container>
  )
}
