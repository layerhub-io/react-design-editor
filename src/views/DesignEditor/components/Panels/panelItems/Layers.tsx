import React from "react"
import { useEditor, useObjects } from "@layerhub-io/react"
import { Block } from "baseui/block"
import AngleDoubleLeft from "~/components/Icons/AngleDoubleLeft"
import Scrollable from "~/components/Scrollable"
import { ILayer } from "@layerhub-io/types"
import Locked from "~/components/Icons/Locked"
import Unlocked from "~/components/Icons/Unlocked"
import Eye from "~/components/Icons/Eye"
import EyeCrossed from "~/components/Icons/EyeCrossed"
import Delete from "~/components/Icons/Delete"
import { Button, KIND, SIZE } from "baseui/button"
import useSetIsSidebarOpen from "~/hooks/useSetIsSidebarOpen"

const Layers = () => {
  const editor = useEditor()
  const objects = useObjects() as ILayer[]
  const [layerObjects, setLayerObjects] = React.useState<any[]>([])
  const setIsSidebarOpen = useSetIsSidebarOpen()

  React.useEffect(() => {
    if (objects) {
      setLayerObjects(objects)
    }
  }, [objects])

  React.useEffect(() => {
    let watcher = async () => {
      if (objects) {
        setLayerObjects([...objects])
      }
    }
    if (editor) {
      editor.on("history:changed", watcher)
    }
    return () => {
      if (editor) {
        editor.off("history:changed", watcher)
      }
    }
  }, [editor, objects])

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
        <Block>Layers</Block>

        <Block onClick={() => setIsSidebarOpen(false)} $style={{ cursor: "pointer", display: "flex" }}>
          <AngleDoubleLeft size={18} />
        </Block>
      </Block>
      <Scrollable>
        <Block padding="0 1.5rem">
          {layerObjects.map((object) => (
            <Block
              $style={{
                display: "grid",
                gridTemplateColumns: "1fr 90px",
                fontSize: "14px",
                alignItems: "center",
                ":hover": {
                  background: "rgb(245,246,247)",
                },
              }}
              key={object.id}
            >
              <Block $style={{ cursor: "pointer" }} onClick={() => editor.objects.select(object.id)}>
                {object.name}
              </Block>
              <Block $style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                {object.locked ? (
                  <Button
                    kind={KIND.tertiary}
                    size={SIZE.mini}
                    onClick={() => editor.objects.unlock(object.id)}
                    overrides={{
                      Root: {
                        style: {
                          paddingLeft: "4px",
                          paddingRight: "4px",
                        },
                      },
                    }}
                  >
                    <Locked size={24} />
                  </Button>
                ) : (
                  <Button
                    kind={KIND.tertiary}
                    size={SIZE.mini}
                    onClick={() => editor.objects.lock(object.id)}
                    overrides={{
                      Root: {
                        style: {
                          paddingLeft: "4px",
                          paddingRight: "4px",
                        },
                      },
                    }}
                  >
                    <Unlocked size={24} />
                  </Button>
                )}

                {object.visible ? (
                  <Button
                    kind={KIND.tertiary}
                    size={SIZE.mini}
                    onClick={() => editor.objects.update({ visible: false }, object.id)}
                    overrides={{
                      Root: {
                        style: {
                          paddingLeft: "4px",
                          paddingRight: "4px",
                        },
                      },
                    }}
                  >
                    <Eye size={24} />
                  </Button>
                ) : (
                  <Button
                    kind={KIND.tertiary}
                    size={SIZE.mini}
                    onClick={() => editor.objects.update({ visible: true }, object.id)}
                    overrides={{
                      Root: {
                        style: {
                          paddingLeft: "4px",
                          paddingRight: "4px",
                        },
                      },
                    }}
                  >
                    <EyeCrossed size={24} />
                  </Button>
                )}
                <Button
                  kind={KIND.tertiary}
                  size={SIZE.mini}
                  onClick={() => editor.objects.remove(object.id)}
                  overrides={{
                    Root: {
                      style: {
                        paddingLeft: "4px",
                        paddingRight: "4px",
                      },
                    },
                  }}
                >
                  <Delete size={24} />
                </Button>
              </Block>
            </Block>
          ))}
        </Block>
      </Scrollable>
    </Block>
  )
}

export default Layers
