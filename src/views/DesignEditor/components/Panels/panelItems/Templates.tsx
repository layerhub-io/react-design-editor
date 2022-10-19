import React from "react"
import { useEditor } from "@layerhub-io/react"
import { Block } from "baseui/block"
import { loadTemplateFonts } from "~/utils/fonts"
import Scrollable from "~/components/Scrollable"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import { useStyletron } from "baseui"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import { useSelector } from "react-redux"
import { selectPublicDesigns } from "~/store/slices/designs/selectors"
import { IDesign } from "~/interfaces/DesignEditor"
import { IScene } from "@layerhub-io/types"
import { nanoid } from "nanoid"
import api from "~/services/api"

export default function () {
  const editor = useEditor()
  const setIsSidebarOpen = useSetIsSidebarOpen()
  const { setCurrentScene, currentScene, setScenes, setCurrentDesign } = useDesignEditorContext()
  const designs = useSelector(selectPublicDesigns)

  const loadGraphicTemplate = async (payload: IDesign): Promise<{ scenes: IScene[]; design: IDesign }> => {
    const scenes: IScene[] = []
    const { scenes: scns, ...design } = payload

    for (const scn of scns) {
      const scene: IScene = {
        name: scn.name,
        frame: payload.frame,
        id: scn.id || nanoid(),
        layers: scn.layers,
        metadata: {},
      }
      await loadTemplateFonts(scene)

      const preview = (await editor.renderer.render(scene)) as string
      scenes.push({ ...scene, preview })
    }

    return { scenes, design: design as IDesign }
  }

  const loadDesignById = React.useCallback(
    async (designId: string) => {
      if (editor) {
        const design = await api.getPublicDesignById(designId)
        const loadedDesign = await loadGraphicTemplate(design)
        setScenes(loadedDesign.scenes)
        setCurrentScene(loadedDesign.scenes[0])
        setCurrentDesign(loadedDesign.design)
      }
    },
    [editor, currentScene]
  )

  console.log(designs);
  

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
        <Block>Templates</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <div style={{ padding: "0 1.5rem" }}>
          <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "1fr 1fr" }}>
            {designs.map((design, index) => {
              return (
                <ImageItem
                  onClick={() => loadDesignById(design.id)}
                  key={index}
                  preview={`${design.previews[0].src}?tr=w-320`}
                />
              )
            })}
          </div>
        </div>
      </Scrollable>
    </Block>
  )
}

function ImageItem({ preview, onClick }: { preview: any; onClick?: (option: any) => void }) {
  const [css] = useStyletron()
  return (
    <div
      onClick={onClick}
      className={css({
        position: "relative",
        background: "#f8f8fb",
        cursor: "pointer",
        borderRadius: "8px",
        overflow: "hidden",
        "::before:hover": {
          opacity: 1,
        },
      })}
    >
      <div
        className={css({
          backgroundImage: `linear-gradient(to bottom,
          rgba(0, 0, 0, 0) 0,
          rgba(0, 0, 0, 0.006) 8.1%,
          rgba(0, 0, 0, 0.022) 15.5%,
          rgba(0, 0, 0, 0.047) 22.5%,
          rgba(0, 0, 0, 0.079) 29%,
          rgba(0, 0, 0, 0.117) 35.3%,
          rgba(0, 0, 0, 0.158) 41.2%,
          rgba(0, 0, 0, 0.203) 47.1%,
          rgba(0, 0, 0, 0.247) 52.9%,
          rgba(0, 0, 0, 0.292) 58.8%,
          rgba(0, 0, 0, 0.333) 64.7%,
          rgba(0, 0, 0, 0.371) 71%,
          rgba(0, 0, 0, 0.403) 77.5%,
          rgba(0, 0, 0, 0.428) 84.5%,
          rgba(0, 0, 0, 0.444) 91.9%,
          rgba(0, 0, 0, 0.45) 100%)`,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0,
          transition: "opacity 0.3s ease-in-out",
          height: "100%",
          width: "100%",
          ":hover": {
            opacity: 1,
          },
        })}
      ></div>
      <img
        src={preview}
        className={css({
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          verticalAlign: "middle",
        })}
      />
    </div>
  )
}