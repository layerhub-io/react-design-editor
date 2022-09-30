import { useContext } from "react"
import { DesignEditorContext } from "~/contexts/DesignEditor"

const useContextMenuSceneRequest = () => {
  const { contextMenuSceneRequest } = useContext(DesignEditorContext)
  return contextMenuSceneRequest
}

export default useContextMenuSceneRequest
