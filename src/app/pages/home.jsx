import { Button } from "@/components/ui/button";
import "../../App.css";
import { useEffect, useState } from "react";

function Home() {
  const [apkUrl, setApkUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://ec2-3-108-205-134.ap-south-1.compute.amazonaws.com:8888/api/release/app/"
        );
        const data = await response.json();

        if (data.url) {
          setApkUrl(data.url);
          
         
        }
      } catch (error) {
        console.error("Error fetching APK URL:", error);
      }
    };

    fetchData();
  }, []);

  const download = () => {
    if (apkUrl) {
      // Open the URL to download the APK file
      window.open(apkUrl, "_blank");
    } else {
      alert("Download link not available");
    }
  };

  return (
    <div className='w-full min-h-[90vh] flex flex-col justify-center items-center gap-10'>
      <h1 className='text-4xl font-bold'>Get Free WiFi With</h1>
      <img src='logo.png' alt='logo' className='w-[50%]' />

      <Button
        className='bg-blue-600 text-white hover:bg-blue-700 hover:box-shadow-md hover:ring-2 hover:ring-blue-500 transition-all duration-300 ease-in-out text-2xl font-bold'
        variant='default'
        onClick={download}
      >
        Download Now
        <img src='ic--round-android.png' className='h-12' />
      </Button>
    </div>
  );
}

export default Home;
