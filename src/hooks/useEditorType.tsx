import { useContext } from "react"
import { DesignEditorContext } from "~/contexts/DesignEditor"

const useEditorType = () => {
  const { editorType } = useContext(DesignEditorContext)
  return editorType
}

export default useEditorType
