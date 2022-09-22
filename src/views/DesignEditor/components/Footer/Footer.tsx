import Graphic from "./Graphic"
import Presentation from "./Presentation"
import Video from "./Video"
import useEditorType from "~/hooks/useEditorType"

export default function () {
  const editorType = useEditorType()

  return (
    <>
      {
        {
          NONE: <></>,
          PRESENTATION: <Presentation />,
          VIDEO: <Video />,
          GRAPHIC: <Graphic />,
        }[editorType]
      }
    </>
  )
}
