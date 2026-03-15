import authReducer, { clearUserlogout } from '@/lib/features/auth/authSlice'

describe('authSlice', () => {
  it('starts with null user and token', () => {
    const state = authReducer(undefined, { type: '@@INIT' })
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('clears user and token on logout', () => {
    const loggedInState = {
      user: { id: '123', email: 'test@example.com' },
      token: 'some-token',
      loading: false,
      error: null,
    }
    const result = authReducer(loggedInState, clearUserlogout())
    expect(result.user).toBeNull()
    expect(result.token).toBeNull()
  })
})
