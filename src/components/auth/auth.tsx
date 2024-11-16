export const signIn = async (credentials: {
  username: string;
  password: string;
}) => {
  const data = await window.electronAPI.fetch({
    method: "POST",
    URL: "user/auth",
    body: { username: credentials.username, password: credentials.password },
  });
  if (!data) throw new Error("Failed to fetch data.");
  if (data.data.role[2] !== "t") throw new Error("Permission denied.")
  
  return data
};

export const signOut = async (ID: string)=>{
  const data = await window.electronAPI.fetch({
    method: "POST",
    URL: "user/logout",
    body: { userID: ID }
  })
  if (!data) throw new Error("Failed to fetch data.");
  
  return data
}

export const getProfile = async (ID: string)=>{
  const data = await window.electronAPI.fetch({
    method: "GET",
    URL: "user/" + ID
  })
  if (!data) return null
  if (data.data.role[2] !== "t") return null
  
  return data
}

export const isAuthenticated = localStorage.getItem("ID")