import { createReducer } from "@reduxjs/toolkit"
import { IDesign } from "~/interfaces/DesignEditor"
import { setPublicDesigns } from "./actions"

export interface DesignsState {
  designs: IDesign[]
  public: IDesign[]
}

const initialState: DesignsState = {
  designs: [],
  public: [],
}

export const designsReducer = createReducer(initialState, (builder) => {
  builder.addCase(setPublicDesigns, (state, { payload }) => {
    state.public = payload
  })
})
