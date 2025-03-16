import { Button } from "@/components/ui/button";
import "../../App.css";
import { useEffect, useState } from "react";

function Home() {
  const [apkUrl, setApkUrl] = useState("");
  const [partnerApkUrl, setPartnerApkUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://app.freeyfi.com/api/release/app/"
        );
        const data = await response.json();

        if (data.url) {
          setApkUrl(data.url);
          
         
        }
      } catch (error) {
        console.error("Error fetching APK URL:", error);
      }
    };

    const fetchPartnerData = async () => {
      try {
        const response = await fetch(
          "https://app.freeyfi.com/api/partner/app/"
        );
        const data = await response.json();

        if (data.url) {
          setPartnerApkUrl(data.url);
        }
      } catch (error) {
        console.error("Error fetching APK URL:", error);
      }
    };

    fetchData();
    fetchPartnerData();
  }, []);

  

  const download = () => {
    if (apkUrl) {
      // Open the URL to download the APK file
      window.open(apkUrl, "_blank");
    } else {
      alert("Download link not available");
    }
  };

   const download2 = () => {
     if (partnerApkUrl) {
       // Open the URL to download the APK file
       window.open(partnerApkUrl, "_blank");
     } else {
       alert("Download link not available");
     }
   };

  return (
    <div className='w-full min-h-[90vh] flex flex-col justify-center items-center gap-10'>
      <h1 className='text-4xl font-bold'>Get Free WiFi With</h1>
      <img src='logo.png' alt='logo' className='w-[50%]' />

      <div className='flex gap-5'>
        <Button
          className='bg-blue-600 text-white hover:bg-blue-700 hover:box-shadow-md hover:ring-2 hover:ring-blue-500 transition-all duration-300 ease-in-out text-2xl font-bold'
          variant='default'
          onClick={download}
        >
          Download Now
          <img src='ic--round-android.png' className='h-12' />
        </Button>
       
        <Button
          className='bg-blue-600 text-white hover:bg-blue-700 hover:box-shadow-md hover:ring-2 hover:ring-blue-500 transition-all duration-300 ease-in-out text-2xl font-bold'
          variant='default'
          onClick={download2}
        >
          Y-Fi Partners
          <img src='ic--round-android.png' className='h-12' />
        </Button>
      </div>
    </div>
  );
}

export default Home;
