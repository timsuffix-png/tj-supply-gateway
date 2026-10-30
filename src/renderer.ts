/**
 * This file will automatically be loaded by webpack and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/latest/tutorial/process-model
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import { IMAGES } from './imagesData';

// Browser polyfill for window.electronAPI when running in a normal web browser
if (typeof window !== 'undefined' && !(window as any).electronAPI) {
  const DEFAULT_API = 'http://localhost:3021/api/v1/';
  (window as any).electronAPI = {
    loadImg: async (imgPath: string): Promise<string> => {
      return IMAGES[imgPath] || '';
    },
    fetch: async (args: { method: string; URL: string; body?: any }): Promise<any> => {
      const apiBase = localStorage.getItem('API_URL') || DEFAULT_API;
      const cleanUrl = args.URL.startsWith('/') ? args.URL.slice(1) : args.URL;
      const fullUrl = apiBase.endsWith('/') ? `${apiBase}${cleanUrl}` : `${apiBase}/${cleanUrl}`;
      try {
        const init: RequestInit = {
          method: args.method,
          headers: {
            'Content-Type': 'application/json',
          },
        };
        if (args.body && args.method !== 'GET') {
          init.body = JSON.stringify(args.body);
        }
        const res = await window.fetch(fullUrl, init);
        if (!res.ok) return null;
        return await res.json();
      } catch (e) {
        console.error('Fetch error:', e);
        return null;
      }
    },
    uploadImg: async (): Promise<any> => null,
    getImg: async (): Promise<any> => null,
    getAPIPath: async (): Promise<string> => localStorage.getItem('API_URL') || DEFAULT_API,
    setAPIPath: (path: string): void => { localStorage.setItem('API_URL', path); },
    portlist: (callback: (ports: any) => void): void => { callback([]); },
    getSeawardCOMPort: async (): Promise<number> => 0,
    setSeawardCOMPort: (port: number): void => {},
    sssTest: async (): Promise<any> => null,
    fakeSssTest: async (): Promise<any> => null,
  };
}

import './app.tsx';

console.log('👋 This message is being logged by "renderer.js", included via webpack');
