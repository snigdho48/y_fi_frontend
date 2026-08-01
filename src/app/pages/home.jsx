import { Button } from "@/components/ui/button";
import "../../App.css";
import { useEffect, useState } from "react";
import { APP_API_BASE } from "@/lib/api";

function Home() {
  const [apkUrl, setApkUrl] = useState("");
  const [partnerApkUrl, setPartnerApkUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${APP_API_BASE}/release/app/`);
        const data = await response.json();
        if (data.url) setApkUrl(data.url);
      } catch (error) {
        console.error("Error fetching APK URL:", error);
      }
    };

    const fetchPartnerData = async () => {
      try {
        const response = await fetch(`${APP_API_BASE}/partner/app/`);
        const data = await response.json();
        if (data.url) setPartnerApkUrl(data.url);
      } catch (error) {
        console.error("Error fetching partner APK URL:", error);
      }
    };

    fetchData();
    fetchPartnerData();
  }, []);

  const download = () => {
    if (apkUrl) window.open(apkUrl, "_blank");
    else alert("Download link not available");
  };

  const download2 = () => {
    if (partnerApkUrl) window.open(partnerApkUrl, "_blank");
    else alert("Download link not available");
  };

  return (
    <div className="flex w-full min-h-[min(85vh,100%)] flex-col items-center justify-center gap-6 px-4 py-10 sm:gap-8 sm:py-14">
      <h1 className="max-w-xl text-center text-2xl font-bold leading-tight text-slate-50 sm:text-3xl md:text-4xl">
        Get Free WiFi With
      </h1>
      <img
        src="logo.png"
        alt="Y FI"
        className="h-auto w-full max-w-[220px] object-contain sm:max-w-[280px] md:max-w-[360px]"
      />

      <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-xl sm:flex-row sm:flex-wrap sm:justify-center sm:gap-4">
        <Button
          className="h-auto w-full whitespace-normal bg-blue-600 px-4 py-3 text-base font-bold text-white transition-all duration-300 ease-in-out hover:bg-blue-700 hover:ring-2 hover:ring-blue-500 sm:w-auto sm:min-w-[11rem] sm:text-lg md:text-xl"
          variant="default"
          onClick={download}
        >
          Download Now
          <img
            src="ic--round-android.png"
            alt=""
            className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
          />
        </Button>

        <Button
          className="h-auto w-full whitespace-normal bg-blue-600 px-4 py-3 text-base font-bold text-white transition-all duration-300 ease-in-out hover:bg-blue-700 hover:ring-2 hover:ring-blue-500 sm:w-auto sm:min-w-[11rem] sm:text-lg md:text-xl"
          variant="default"
          onClick={download2}
        >
          Y-Fi Partners
          <img
            src="ic--round-android.png"
            alt=""
            className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
          />
        </Button>
      </div>
    </div>
  );
}

export default Home;
