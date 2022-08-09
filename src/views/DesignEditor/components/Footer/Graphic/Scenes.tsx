import React from "react"
import { styled, useStyletron } from "baseui"
import { Theme } from "baseui/theme"
import Add from "~/components/Icons/Add"
import useDesignEditorPages from "~/hooks/useDesignEditorScenes"
import { DesignEditorContext } from "~/contexts/DesignEditor"
import { nanoid } from "nanoid"
import { defaultTemplate } from "~/constants/design-editor"
import { useEditor } from "@scenify/react"
import { IDesign } from "@scenify/types"

const Container = styled<"div", {}, Theme>("div", ({ $theme }) => ({
  background: $theme.colors.white,
  padding: "0.25rem 0.75rem",
}))

export default function () {
  const scenes = useDesignEditorPages()
  const { setScenes, setCurrentScene, currentScene } = React.useContext(DesignEditorContext)
  const editor = useEditor()
  const [css] = useStyletron()
  const [currentPreview, setCurrentPreview] = React.useState("")

  React.useEffect(() => {
    if (editor && scenes && currentScene) {
      const isCurrentSceneLoaded = scenes.find((s) => s.id === currentScene?.id)
      if (!isCurrentSceneLoaded) {
        setCurrentScene(scenes[0])
      }
    }
  }, [editor, scenes, currentScene])

  React.useEffect(() => {
    let watcher = async () => {
      const updatedTemplate = editor.design.exportToJSON()
      const updatedPreview = (await editor.renderer.render(updatedTemplate)) as string
      setCurrentPreview(updatedPreview)
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor])

  React.useEffect(() => {
    if (editor) {
      if (currentScene) {
        updateCurrentScene(currentScene)
      } else {
        editor.design
          .importFromJSON(defaultTemplate)
          .then(() => {
            const initialDesign = editor.design.exportToJSON() as any
            editor.renderer.render(initialDesign).then((data) => {
              setCurrentScene({ ...initialDesign, preview: data })
              setScenes([{ ...initialDesign, preview: data }])
            })
          })
          .catch(console.log)
      }
    }
  }, [editor, currentScene])

  const updateCurrentScene = React.useCallback(
    async (design: IDesign) => {
      await editor.design.importFromJSON(design)
      const updatedPreview = (await editor.renderer.render(design)) as string
      setCurrentPreview(updatedPreview)
    },
    [editor, currentScene]
  )

  const addPage = React.useCallback(async () => {
    setCurrentPreview("")
    const updatedTemplate = editor.design.exportToJSON()
    const updatedPreview = await editor.renderer.render(updatedTemplate)

    const updatedPages = scenes.map((p) => {
      if (p.id === updatedTemplate.id) {
        return { ...updatedTemplate, preview: updatedPreview }
      }
      return p
    })
    const newPreview = await editor.renderer.render(defaultTemplate)
    const newPage = { ...defaultTemplate, id: nanoid(), preview: newPreview } as any
    const newPages = [...updatedPages, newPage] as any[]
    setScenes(newPages)
    setCurrentScene(newPage)
  }, [scenes])

  const changePage = React.useCallback(
    async (page: any) => {
      setCurrentPreview("")
      if (editor) {
        const updatedTemplate = editor.design.exportToJSON()
        const updatedPreview = await editor.renderer.render(updatedTemplate)

        const updatedPages = scenes.map((p) => {
          if (p.id === updatedTemplate.id) {
            return { ...updatedTemplate, preview: updatedPreview }
          }
          return p
        }) as any[]

        setScenes(updatedPages)
        setCurrentScene(page)
      }
    },
    [editor, scenes, currentScene]
  )

  return (
    <Container>
      <div className={css({ display: "flex", alignItems: "center" })}>
        {scenes.map((page, index) => (
          <div
            style={{
              background: page.id === currentScene?.id ? "rgb(243,244,246)" : "#ffffff",
              padding: "1rem 0.5rem",
            }}
            key={index}
          >
            <div
              onClick={() => changePage(page)}
              className={css({
                cursor: "pointer",
                position: "relative",
                border: page.id === currentScene?.id ? "2px solid #7158e2" : "2px solid rgba(0,0,0,.15)",
              })}
            >
              <img
                style={{ maxWidth: "90px", maxHeight: "80px", display: "flex" }}
                src={currentPreview && page.id === currentScene?.id ? currentPreview : page.preview}
              />
              <div
                className={css({
                  position: "absolute",
                  bottom: "4px",
                  right: "4px",
                  background: "rgba(0,0,0,0.4)",
                  color: "#fff",
                  fontSize: "10px",
                  borderRadius: "2px",
                  height: "16px",
                  width: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                {index + 1}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            background: "#ffffff",
            padding: "1rem 1rem 1rem 0.5rem",
          }}
        >
          <div
            onClick={addPage}
            className={css({
              width: "100px",
              height: "56px",
              background: "rgb(243,244,246)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            })}
          >
            <Add size={20} />
          </div>
        </div>
      </div>
    </Container>
  )
}
