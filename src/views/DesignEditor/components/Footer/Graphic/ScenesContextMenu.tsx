import React from "react"
import {Block} from "baseui/block"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import {nanoid} from "nanoid"
import useOnClickOutside from "~/hooks/useOnClickOutside"

export default function () {
    const {scenes, setScenes, setContextMenuSceneRequest, contextMenuSceneRequest, currentScene} =
        useDesignEditorContext()
    const ref = React.useRef<HTMLDivElement | null>(null)

    useOnClickOutside(ref, () => {
        setContextMenuSceneRequest({...contextMenuSceneRequest, visible: false})
    })

    const makeDeleteScene = () => {
        const updatedScenes = scenes.filter((scene) => scene.id !== contextMenuSceneRequest.id)
        setContextMenuSceneRequest({...contextMenuSceneRequest, visible: false})
        setScenes(updatedScenes)
    }

    const makeAddScene = () => {
    }

    const makeDuplicateScene = () => {
        const currentScene = scenes.find((scene) => scene.id === contextMenuSceneRequest.id)
        const updatedScenes = [...scenes, {...currentScene, id: nanoid()}]
        //  @ts-ignore
        setScenes(updatedScenes)
        setContextMenuSceneRequest({...contextMenuSceneRequest, visible: false})
    }

    return (
        <Block
            ref={ref}
            $style={{
                width: "160px",
                position: "absolute",
                background: "#ffffff",
                boxShadow: "0 0 0 1px rgba(64,87,109,0.07),0 2px 12px rgba(53,71,90,0.2)",
                zIndex: 4,
                top: `${contextMenuSceneRequest.top - 80}px`,
                left: `${contextMenuSceneRequest.left - 453}px`,
                padding: "0.5rem 0",
            }}
        >
            <Block
                onClick={makeDuplicateScene}
                $style={{
                    fontSize: "14px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 1rem",
                    ":hover": {
                        backgroundColor: "rgba(0,0,0,0.1)",
                        cursor: "pointer",
                    },
                }}
            >
                Duplicate Scene
            </Block>
            <Block
                onClick={makeDeleteScene}
                $style={{
                    fontSize: "14px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 1rem",
                    ":hover": {
                        backgroundColor: "rgba(0,0,0,0.1)",
                        cursor: "pointer",
                    },
                }}
            >
                Delete Scene
            </Block>
        </Block>
    )
}
