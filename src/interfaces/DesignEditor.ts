import { IFrame } from "@layerhub-io/types"

export interface Page {
  id: string
  name: string
  preview: string
}

export type DesignType = "GRAPHIC" | "PRESENTATION" | "VIDEO" | "NONE"

export interface ContextMenuTimelineRequest {
  id: string
  top: number
  left: number
  visible: boolean
}

export interface ContextMenuSceneRequest {
  id: string
  top: number
  left: number
  visible: boolean
}

export interface IDesign {
  id: string
  name: string
  frame: IFrame
  type: string
  scenes: any[]
  preview: string
  metadata: {}
}
