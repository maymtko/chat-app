import { NextResponse } from 'next/server'
//Get messages from room
export async function GET(req: Request,  context: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await context.params

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}rooms/${roomId}/messages`, {
  })

if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: res.status }
    );
  }

  const data = await res.json()
  
  return NextResponse.json(data)
}
