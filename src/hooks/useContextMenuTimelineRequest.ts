import { useContext } from "react"
import { DesignEditorContext } from "~/contexts/DesignEditor"

const useContextMenuTimelineRequest = () => {
  const { contextMenuTimelineRequest } = useContext(DesignEditorContext)
  return contextMenuTimelineRequest
}

export default useContextMenuTimelineRequest
