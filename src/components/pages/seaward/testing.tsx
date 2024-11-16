import { useEffect, useRef } from "react"
import { useAuth } from "../../auth/authProvider";

export default function Testing() {
  const auth = useAuth()
  const imageRef = useRef(null)
  
  useEffect(()=>{
    if (imageRef.current){
      const loadImage = async () => {
        const loading = await window.electronAPI.loadImg("loading.gif");
        try{
          imageRef.current.src = loading;
        }
        catch{}
      };
      loadImage();
    }
  }, [auth])
  
  return (
    <div className="flex min-h-screen justify-center items-center absolute w-screen h-screen bg-white left-0 top-0">
      <img ref={imageRef} alt="my gif" height={100} width={100} />
      <p>กำลังทดสอบ กรุณารอสักครู่</p>
    </div>
  );
}
