import React, {useCallback} from "react"
import {styled, useStyletron} from "baseui"
import {Theme} from "baseui/theme"
import Add from "~/components/Icons/Add"
import useDesignEditorPages from "~/hooks/useDesignEditorScenes"
import {DesignEditorContext} from "~/contexts/DesignEditor"
import {nanoid} from "nanoid"
import {getDefaultTemplate} from "~/constants/design-editor"
import {useEditor} from "@layerhub-io/react"
import {IScene} from "@layerhub-io/types"
import ScenesItem from "./ScenesItem";
import ScenesContextMenu from "./ScenesContextMenu";
import useContextMenuSceneRequest from "~/hooks/useContextMenuSceneRequest";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import update from "immutability-helper";

const Container = styled<"div", {}, Theme>("div", ({$theme}) => ({
    background: $theme.colors.white,
    padding: "0.25rem 0.75rem",
}))

export default function () {
    const scenes = useDesignEditorPages()
    const {setScenes, setCurrentScene, currentScene, setCurrentDesign, currentDesign} =
        React.useContext(DesignEditorContext)
    const editor = useEditor()
    const contextMenuSceneRequest = useContextMenuSceneRequest()
    const [css] = useStyletron()
    const [currentPreview, setCurrentPreview] = React.useState("")

    const findScene = useCallback(
        (id: string) => {
            const card = scenes.filter((c) => `${c.id}` === id)[0] as IScene
            return {
                card,
                index: scenes.indexOf(card),
            }
        },
        [scenes],
    )

    const moveScene = useCallback(
        (id: string, atIndex: number) => {
            const {card, index} = findScene(id)
            setScenes(
                update(scenes, {
                    $splice: [
                        [index, 1],
                        [atIndex, 0, card],
                    ],
                }),
            )
        },
        [findScene, scenes, setScenes],
    )


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
            const updatedTemplate = editor.scene.exportToJSON()
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
                const defaultTemplate = getDefaultTemplate({
                    width: 1200,
                    height: 1200,
                })
                setCurrentDesign({
                    id: nanoid(),
                    frame: defaultTemplate.frame,
                    metadata: {},
                    name: "Untitled Design",
                    preview: "",
                    scenes: [],
                    type: "PRESENTATION",
                })
                editor.scene
                    .importFromJSON(defaultTemplate)
                    .then(() => {
                        const initialDesign = editor.scene.exportToJSON() as any
                        editor.renderer.render(initialDesign).then((data) => {
                            setCurrentScene({...initialDesign, preview: data})
                            setScenes([{...initialDesign, preview: data}])
                        })
                    })
                    .catch(console.log)
            }
        }
    }, [editor, currentScene])

    const updateCurrentScene = React.useCallback(
        async (design: IScene) => {
            await editor.scene.importFromJSON(design)
            const updatedPreview = (await editor.renderer.render(design)) as string
            setCurrentPreview(updatedPreview)
        },
        [editor, currentScene]
    )

    const addScene = React.useCallback(async () => {
        setCurrentPreview("")
        const updatedTemplate = editor.scene.exportToJSON()
        const updatedPreview = await editor.renderer.render(updatedTemplate)

        const updatedPages = scenes.map((p) => {
            if (p.id === updatedTemplate.id) {
                return {...updatedTemplate, preview: updatedPreview}
            }
            return p
        })

        const defaultTemplate = getDefaultTemplate(currentDesign.frame)
        const newPreview = await editor.renderer.render(defaultTemplate)
        const newPage = {...defaultTemplate, id: nanoid(), preview: newPreview} as any
        const newPages = [...updatedPages, newPage] as any[]
        setScenes(newPages)
        setCurrentScene(newPage)
    }, [scenes, currentDesign])

    const changePage = React.useCallback(
        async (page: any) => {
            setCurrentPreview("")
            if (editor) {
                const updatedTemplate = editor.scene.exportToJSON()
                const updatedPreview = await editor.renderer.render(updatedTemplate)

                const updatedPages = scenes.map((p) => {
                    if (p.id === updatedTemplate.id) {
                        return {...updatedTemplate, preview: updatedPreview}
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
            {contextMenuSceneRequest.visible && <ScenesContextMenu/>}
            <DndProvider backend={HTML5Backend}>
                <div className={css({display: "flex", alignItems: "center"})}>
                    {scenes.map((page, index) => (
                        <ScenesItem key={index}
                                    index={index}
                                    page={page}
                                    moveScene={moveScene}
                                    findScene={findScene}
                                    changePage={changePage}
                                    currentPreview={currentPreview}/>
                    ))}
                    <div
                        style={{
                            background: "#ffffff",
                            padding: "1rem 1rem 1rem 0.5rem",
                        }}
                    >
                        <div
                            onClick={addScene}
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
                            <Add size={20}/>
                        </div>
                    </div>
                </div>
            </DndProvider>
        </Container>
    )
}
