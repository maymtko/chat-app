export async function logout() {
  const res = await fetch(`http://localhost:8000/auth/logout`, {
    method: "POST",
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error("Logout failed");
  }

  return res.json();
}
