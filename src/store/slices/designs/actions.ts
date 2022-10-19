import { createAsyncThunk, createAction } from "@reduxjs/toolkit"
import { IDesign } from "~/interfaces/DesignEditor"
import api from "~/services/api"

export const setDesign = createAction<IDesign>("designs/setDesign")
export const setPublicDesigns = createAction<IDesign[]>("designs/setPublicDesigns")
export const unsetDesign = createAction<{ id: string }>("designs/unsetDesign")

export const getPublicDesigns = createAsyncThunk<void, never, { rejectValue: Record<string, string[]> }>(
  "designs/getPublicDesigns",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const designs = await api.getPublicDesigns()
      dispatch(setPublicDesigns(designs))
    } catch (err) {
      return rejectWithValue((err as any).response?.data?.error.data || null)
    }
  }
)
