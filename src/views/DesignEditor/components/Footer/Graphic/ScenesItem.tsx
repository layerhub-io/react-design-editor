import React from "react"
import {useStyletron} from "baseui";
import {DesignEditorContext} from "~/contexts/DesignEditor";
import useDesignEditorContext from "~/hooks/useDesignEditorContext";


export default function ({page, index, changePage, currentPreview}: any) {
    const sceneItemRef = React.useRef<HTMLDivElement>(null)
    const {currentScene} = React.useContext(DesignEditorContext)
    const [markerRefPosition, setMarkerRefPosition] = React.useState({y: 0})
    const [css] = useStyletron()
    const {setContextMenuSceneRequest} = useDesignEditorContext()


    const onMouseMoveItem = (evt: any) => {
        if (sceneItemRef.current) {
            const position = evt.pageX - sceneItemRef.current?.getBoundingClientRect().left
            setMarkerRefPosition({y: position})
        }
    }
    const refBoundingRect = sceneItemRef.current?.getBoundingClientRect()

    React.useEffect(() => {
        const sceneItemDiv = sceneItemRef.current
        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault()
            setContextMenuSceneRequest({
                // @ts-ignore
                id: sceneItemDiv.id,
                left: event.pageX,
                top: event.pageY,
                visible: true,
            })
        }
        if (sceneItemDiv) {
            sceneItemDiv.addEventListener("contextmenu", handleContextMenu)
        }
        return () => {
            if (sceneItemDiv) {
                sceneItemDiv.removeEventListener("contextmenu", handleContextMenu)
            }
        }
    }, [sceneItemRef])

    return <div
        onMouseMove={onMouseMoveItem}
        key={index}
        ref={sceneItemRef}
        id={page.id}
        style={{
            background: page.id === currentScene?.id ? "rgb(243,244,246)" : "#ffffff",
            padding: "1rem 0.5rem",
        }}
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
                style={{maxWidth: "90px", maxHeight: "80px", display: "flex"}}
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
}

