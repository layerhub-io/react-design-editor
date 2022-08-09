import { IDesign } from "@scenify/types"
import React from "react"
import { DesignType } from "~/interfaces/DesignEditor"

interface IDesignEditorContext {
  scenes: IDesign[]
  setScenes: (value: ((prevState: IDesign[]) => IDesign[]) | IDesign[]) => void
  currentScene: IDesign | null
  setCurrentScene: React.Dispatch<React.SetStateAction<IDesign | null>>
  isSidebarOpen: boolean
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
  editorType: DesignType
  setEditorType: React.Dispatch<React.SetStateAction<DesignType>>
  displayPlayback: boolean
  setDisplayPlayback: React.Dispatch<React.SetStateAction<boolean>>
  displayPreview: boolean
  setDisplayPreview: React.Dispatch<React.SetStateAction<boolean>>
}

export const DesignEditorContext = React.createContext<IDesignEditorContext>({
  scenes: [],
  setScenes: () => {},
  currentScene: null,
  setCurrentScene: () => {},
  isSidebarOpen: true,
  setIsSidebarOpen: () => {},
  editorType: "NONE",
  setEditorType: () => {},
  displayPlayback: false,
  setDisplayPlayback: () => {},
  displayPreview: false,
  setDisplayPreview: () => {},
})

export const DesignEditorProvider = ({ children }: { children: React.ReactNode }) => {
  const [scenes, setScenes] = React.useState<IDesign[]>([])
  const [currentScene, setCurrentScene] = React.useState<IDesign | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [editorType, setEditorType] = React.useState<DesignType>("NONE")
  const [displayPlayback, setDisplayPlayback] = React.useState<boolean>(false)
  const [displayPreview, setDisplayPreview] = React.useState<boolean>(false)

  const context = {
    scenes,
    setScenes,
    currentScene,
    setCurrentScene,
    isSidebarOpen,
    setIsSidebarOpen,
    editorType,
    setEditorType,
    displayPlayback,
    setDisplayPlayback,
    displayPreview,
    setDisplayPreview,
  }
  return <DesignEditorContext.Provider value={context}>{children}</DesignEditorContext.Provider>
}
