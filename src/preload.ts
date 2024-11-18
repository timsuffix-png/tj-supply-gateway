// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  loadImg: async (path: string)=>ipcRenderer.invoke("loadImg", path),
  fetch: async (fetch: {method: string, URL: string, body: JSON})=>ipcRenderer.invoke("fetch", fetch),
  uploadImg: async (args: {method: string, URL: string})=>ipcRenderer.invoke("uploadImg", args),
  getImg: async (args: {method: string, URL: string})=>ipcRenderer.invoke("getImg", args),
  getAPIPath: ()=>ipcRenderer.invoke("getAPIPath"),
  setAPIPath: (path: string)=>ipcRenderer.send("setAPIPath", path),
  portlist: (callback: (portList: any)=>void)=>ipcRenderer.on("portlist", (event, portList)=>callback(portList)),
  getSeawardCOMPort: ()=>ipcRenderer.invoke("getSeawardCOMPort"),
  setSeawardCOMPort: (port: number)=>ipcRenderer.send("setSeawardCOMPort", port),
  sssTest: (args: {script: string, COM: string})=>ipcRenderer.invoke("sssTest", args),
  fakeSssTest: (args: {script: string, COM: string})=>ipcRenderer.invoke("fakeSssTest", args),
})