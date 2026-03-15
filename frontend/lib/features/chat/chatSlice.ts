import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Message {
    senderId: string
    text: string
    createdAt: string | null
}

export interface Room {
    id: string
    name: string
    members: string[]
}

interface ChatState {
  rooms: Room[]
  messages: Message[]
  loading: boolean
  chatLoading: boolean
  error: string | null
}

const initialState: ChatState = {
    rooms: [],
    messages: [],
    loading: false,
    chatLoading: false,
    error: null,
}

export const fetchRooms = createAsyncThunk(
  'chat/fetchRooms',
  async () => {
    const res = await fetch('/api/rooms')
    return res.json()
  }
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (roomId: string) => {
    const res = await fetch(`/api/rooms/${roomId}/messages`)
    return res.json()
  }
)

// export const sendMessage = createAsyncThunk(
//   'chat/sendMessage',
//   async ({ roomId, text }: { roomId: string; text: string }) => {
//     const res = await fetch(`/api/rooms/${roomId}/messages`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text }),
//     })
//     return res.json()
//   }
// )
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ roomId, text }: { roomId: string; text: string }) => {
    const res = await fetch(`/api/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    return res.json()
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<ChatState>) => {
      return action.payload;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRooms.pending, s => { s.loading = true })
      .addCase(fetchRooms.fulfilled, (s, a) => {
        s.loading = false
        s.rooms = a.payload.rooms
      })
      .addCase(fetchMessages.pending, (s) => {
        s.chatLoading = true
      })
      .addCase(fetchMessages.fulfilled, (s, a) => {
        s.messages = a.payload.messages
        s.chatLoading = false
      })
      .addCase(fetchMessages.rejected, (s, a) => {
        s.chatLoading = false
        s.error = a.payload as string ?? null
      })
      .addCase(sendMessage.fulfilled, (s, a) => {
        s.messages.push(a.payload)
      })
  },
})

export const {  addMessage, clearMessages } = chatSlice.actions;

export default chatSlice.reducer
