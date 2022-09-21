import React from "react"
import {IFrame} from "@layerhub-io/types"
import {Block} from "baseui/block"
import VerticalLine from "~/components/Icons/VerticalLine"
import {Resizable} from "~/components/Resizable"
import {useTimer} from "@layerhub-io/use-timer"
import useDesignEditorScenes from "~/hooks/useDesignEditorScenes"
import useDesignEditorContext from "~/hooks/useDesignEditorContext"
import {useDrag, useDrop} from "react-dnd";
import {ItemTypes} from "~/views/DesignEditor/components/Footer/Video/itemType";

const RightHandle = ({isHover, setControlHover}: { isHover: boolean; setControlHover: (v: boolean) => void }) => (
    <div
        onMouseEnter={() => setControlHover(true)}
        onMouseLeave={() => setControlHover(false)}
        style={{
            background: "rgba(0,0,0,0.25)",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isHover ? 1 : 0,
            cursor: "col-resize",
        }}
    >
        <VerticalLine size={24}/>
    </div>
)

interface TimelineItemProps {
    id: string
    preview: string
    frame: IFrame
    width: number
    height: number
    makeResizeTimelineItem: (id: string, props: any) => void
    duration: number
    isCurrentScene: boolean,
    moveScene: (id: string, to: number) => void
    findScene: (id: string) => { index: number }
}

interface Item {
    id: string
    originalIndex: number
}

export default function ({
                             id,
                             preview,
                             frame,
                             width,
                             height,
                             duration,
                             isCurrentScene,
                             moveScene,
                             findScene,
                             makeResizeTimelineItem,
                         }: TimelineItemProps) {
    const [markerRefPosition, setMarkerRefPosition] = React.useState({y: 0})
    const {setContextMenuTimelineRequest} = useDesignEditorContext()
    const {setTime} = useTimer()
    const timeLineItemRef = React.useRef<HTMLDivElement>(null)
    const scenes = useDesignEditorScenes()
    const [options, setOptions] = React.useState({
        isControlHover: false,
        isResizing: false,
        isItemHover: false,
    })

    const originalIndex = findScene(id).index
    const [{isDragging}, drag] = useDrag(
        () => ({
            type: ItemTypes.SCENE,
            item: {id, originalIndex},
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
            end: (item, monitor) => {
                const {id: droppedId, originalIndex} = item
                const didDrop = monitor.didDrop()
                if (!didDrop) {
                    moveScene(droppedId, originalIndex)
                }
            },
        }),
        [id, originalIndex, moveScene],
    )

    const [, drop] = useDrop(
        () => ({
            accept: ItemTypes.SCENE,
            hover({id: draggedId}: Item) {
                if (draggedId !== id) {
                    const {index: overIndex} = findScene(id)
                    moveScene(draggedId, overIndex)
                }
            },
        }),
        [findScene, moveScene],
    )

    React.useEffect(() => {
        const timeLineItemDiv = timeLineItemRef.current
        const handleContextMenu = (event: MouseEvent) => {
            event.preventDefault()
            setContextMenuTimelineRequest({
                id,
                left: event.pageX,
                top: event.pageY,
                visible: true,
            })
        }
        if (timeLineItemDiv) {
            timeLineItemDiv.addEventListener("contextmenu", handleContextMenu)
        }
        return () => {
            if (timeLineItemDiv) {
                timeLineItemDiv.removeEventListener("contextmenu", handleContextMenu)
            }
        }
    }, [timeLineItemRef])

    const setControlHover = React.useCallback(
        (isHover: boolean) => {
            setOptions({...options, isControlHover: isHover})
        },
        [options]
    )

    const onMouseMoveItem = (evt: any) => {
        if (timeLineItemRef.current) {
            const position = evt.pageX - timeLineItemRef.current?.getBoundingClientRect().left
            setMarkerRefPosition({y: position})
        }
    }
    const refBoundingRect = timeLineItemRef.current?.getBoundingClientRect()

    const setTimeByMarker = React.useCallback(
        (id: string, change: number) => {
            const currentIndex = scenes.findIndex((scn) => scn.id === id)
            if (currentIndex > -1) {
                const prevScenes = scenes.slice(0, currentIndex)
                const prevDuration = prevScenes.reduce(function (previousVal, currentValue) {
                    return previousVal + currentValue.duration!
                }, 0)
                setTime(prevDuration + change)
            }
        },
        [scenes]
    )

    return (
        <Resizable
            onResizeStart={() => setOptions({...options, isResizing: true})}
            onResizeStop={(e, direction, ref, d) => {
                setOptions({
                    ...options,
                    isResizing: false,
                })
                makeResizeTimelineItem(id, {
                    width: width + d.width,
                    height: height + d.height,
                })
            }}
            enable={{
                left: true,
                right: true,
            }}
            style={{
                overflow: "hidden",
                borderRadius: "10px",
                border: isCurrentScene ? "2px solid #7158e2" : "2px solid rgba(0,0,0,.15)",
            }}
            size={{width: width, height: height}}
            handleComponent={{
                right: <RightHandle setControlHover={setControlHover}
                                    isHover={options.isControlHover || options.isResizing}/>,
                left: <RightHandle setControlHover={setControlHover}
                                   isHover={options.isControlHover || options.isResizing}/>,
            }}
        >
            <Block
                onMouseMove={onMouseMoveItem}
                ref={(ref: any) => {
                    drag(drop(ref))
                }}
                $style={{
                    background: "rgb(243,244,246)",
                    width: "100%",
                    height: "100%",
                }}
            >
                <Block
                    ref={timeLineItemRef}
                    onMouseEnter={() => setOptions({...options, isItemHover: true})}
                    onMouseLeave={() => setOptions({...options, isItemHover: false, isControlHover: false})}
                    $style={{
                        cursor: "pointer",
                        position: "relative",
                    }}
                >
                    <Block
                        $style={{
                            backgroundImage: `url(${preview})`,
                            backgroundSize: `${frame ? (frame.width * 70) / frame.height : 70}px 70px`,
                            backgroundRepeat: "repeat",
                            height: "70px",
                        }}
                    ></Block>

                    {options.isItemHover &&
                        refBoundingRect &&
                        markerRefPosition.y + 22 < refBoundingRect.width &&
                        markerRefPosition.y > 22 && (
                            <Block
                                onClick={() => {
                                    setTimeByMarker(id, markerRefPosition.y * 40)
                                }}
                                $style={{
                                    position: "absolute",
                                    left: `${markerRefPosition.y}px`,
                                    bottom: "0px",
                                    height: "70px",
                                    width: "2px",
                                    backgroundColor: "#333333",
                                    transform: "translate(0, -2px)",
                                    cursor: "pointer",
                                }}
                            ></Block>
                        )}

                    <Block
                        $style={{
                            position: "absolute",
                            bottom: "4px",
                            left: "8px",
                            background: "rgba(0,0,0,0.65)",
                            color: "#fff",
                            fontSize: "10px",
                            borderRadius: "8px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0.15rem 0.35rem",
                        }}
                    >
                        {(duration / 1000).toFixed(1)}s
                    </Block>
                </Block>
            </Block>
        </Resizable>
    )
}
