import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import privacyMd from "@/legal/PRIVACY_POLICY.md?raw";
import "../../App.css";

function Privacy() {
  return (
    <article className="privacy-md privacy-md--dark mx-auto w-full max-w-3xl px-4 py-10 text-slate-300">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{privacyMd}</ReactMarkdown>
    </article>
  );
}

export default Privacy;
