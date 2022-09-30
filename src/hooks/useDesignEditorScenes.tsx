import React from "react"
import { DesignEditorContext } from "~/contexts/DesignEditor"

const useDesignEditorScenes = () => {
  const { scenes } = React.useContext(DesignEditorContext)
  return scenes
}

export default useDesignEditorScenes
