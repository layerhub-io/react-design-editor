import React, {useCallback} from "react"
import {Block} from "baseui/block"
import update from 'immutability-helper'
import {DesignEditorContext} from "~/contexts/DesignEditor"
import TimelineItem from "./TimelineItem"
import {useEditor, useFrame} from "@layerhub-io/react"
import {IScene} from "@layerhub-io/types";
import {useDrop} from "react-dnd";
import {ItemTypes} from "~/views/DesignEditor/components/Footer/Video/itemType";

export default function () {
    const {currentScene, scenes, currentPreview, setCurrentPreview, setScenes} = React.useContext(DesignEditorContext)
    const editor = useEditor()
    const frame = useFrame()
    const [, drop] = useDrop(() => ({accept: ItemTypes.SCENE}))

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
        let watcher = async () => {
            const updatedTemplate = editor.scene.exportToJSON()
            const updatedPreview = (await editor.renderer.render(updatedTemplate)) as any
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

    const makeResizeTimelineItem = React.useCallback(
        (id: string, props: any) => {
            const updatedItems = scenes.map((scene) => {
                if (scene.id === id) {
                    return {
                        ...scene,
                        duration: props.width * 40,
                    }
                }
                return scene
            })

            setScenes(updatedItems)
        },
        [scenes]
    )

    return (
        <Block ref={drop} $style={{display: "flex"}}>
            {scenes.map((page) => {
                return (
                    <TimelineItem
                        makeResizeTimelineItem={makeResizeTimelineItem}
                        width={page.duration ? page.duration / 40 : 5000 / 40}
                        duration={page.duration ? page.duration : 5000}
                        height={70}
                        key={page.id}
                        frame={frame}
                        id={page.id}
                        moveScene={moveScene}
                        findScene={findScene}
                        preview={currentPreview && page.id === currentScene?.id ? currentPreview : page.preview || ""}
                        isCurrentScene={(currentScene && currentScene.id === page.id) || false}
                    />
                )
            })}
        </Block>
    )
}

// 125px => 5s
// 25px => 1s

// markerRefPosition.y * 40

// px * 40 === time

// 125 * 40 === 5000
