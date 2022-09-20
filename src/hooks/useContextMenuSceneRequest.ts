import { useContext } from "react"
import { DesignEditorContext } from "~/contexts/DesignEditor"

function useContextMenuSceneRequest() {
  const {
    contextMenuSceneRequest
  } = useContext(DesignEditorContext)
  return contextMenuSceneRequest
}

export default useContextMenuSceneRequest
