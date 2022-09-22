import { IScene } from "@layerhub-io/types"
import { Block } from "baseui/block"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface Props {
  isCurrentScene: boolean
  scene: IScene
  preview: string
  index: number
  changePage: (p: IScene) => void
}

export default function ({ isCurrentScene, scene, preview, index, changePage }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: scene.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "#ffffff",
    cursor: "pointer",
  }

  return (
    <Block
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      $style={{
        background: isCurrentScene ? "rgb(243,244,246)" : "#ffffff",
        padding: "1rem 0.5rem",
        ...style,
      }}
    >
      <Block
        onClick={() => changePage(scene)}
        $style={{
          cursor: "pointer",
          position: "relative",
          border: isCurrentScene ? "2px solid #7158e2" : "2px solid rgba(0,0,0,.15)",
        }}
      >
        <img style={{ maxWidth: "90px", maxHeight: "80px", display: "flex" }} src={preview} />
        <Block
          $style={{
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
          }}
        >
          {index + 1}
        </Block>
      </Block>
    </Block>
  )
}
