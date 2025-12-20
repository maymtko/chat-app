import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface AuthState {
  user: any | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: true,
  error: null,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    thunkAPI
  ) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!res.ok) {
      const error = await res.json()
      return thunkAPI.rejectWithValue(error.detail || 'Login failed')
    }

    return res.json()
  }
)
export const fetchUser = createAsyncThunk(
  'auth/user',
  async (_, thunkAPI) => {
    const res = await fetch('/api/auth/user')
    if (!res.ok) throw new Error('Not authenticated')
    return res.json()
  }
)
// export const logoutUser = createAsyncThunk(
//   'auth/logout',
//   async (
//     credentials: { email: string; password: string },
//     thunkAPI
//   ) => {
//     const res = await fetch('/api/auth/logout', {
//       method: 'POST',
//       // headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(credentials),
//     })

//     if (!res.ok) {
//       const error = await res.json()
//       return thunkAPI.rejectWithValue(error.detail || 'Logout failed')
//     }

//     return res.json()
//   }
// )

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearUserlogout(state) {
      state.user = null
      state.token = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.token = action.payload.access_token
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action: any) => {
        state.loading = false
        state.error = action.payload
      })
     .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
     .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
     .addCase(fetchUser.rejected, (state) => {
        state.user = null
        state.loading = false
      })

  },
})

export const { clearUserlogout } = authSlice.actions
export default authSlice.reducer
