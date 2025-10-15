"use client";
import { GuideStep } from "../shared/GuideStep";
import { CodeBlock } from "../shared/CodeBlock";
import { WarningBanner } from "../shared/WarningBanner";

interface IFrameGuideProps {
  tempCollectionName: string;
  isDark: boolean;
  onComplete?: () => void;
}

export const IFrameGuide = ({
  tempCollectionName,
  isDark,
}: IFrameGuideProps) => {
  const iframeCode = `<iframe
  src="https://yourapp.com/chat/${tempCollectionName}"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
  allow="clipboard-write"
></iframe>`;

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-gray-100" : "text-slate-900"
          }`}
        >
          iFrame Embed
        </h3>
        <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-600"}`}>
          Embed your chatbot directly into any webpage
        </p>
      </div>

      <div className="space-y-4">
        <GuideStep
          stepNumber={1}
          title="Copy the iFrame Code"
          description="This HTML code will embed your chatbot on any website"
          isDark={isDark}
        >
          <CodeBlock code={iframeCode} isDark={isDark} />
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Paste in Your Website"
          description="Add this code wherever you want the chatbot to appear"
          isDark={isDark}
          delay={0.1}
        >
          <ul
            className={`space-y-2 text-sm ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            <li>• Open your website&apos;s HTML file or CMS editor</li>
            <li>• Find where you want to place the chatbot</li>
            <li>• Paste the iFrame code</li>
            <li>• Save and publish your changes</li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Customize (Optional)"
          description="Adjust the size and appearance to match your site"
          isDark={isDark}
          delay={0.2}
        >
          <div
            className={`space-y-3 text-sm ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            <div>
              <span className="font-medium">Width:</span> Change{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                width=&quot;100%&quot;
              </code>{" "}
              to any size (e.g., &quot;400px&quot;)
            </div>
            <div>
              <span className="font-medium">Height:</span> Change{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                height=&quot;600&quot;
              </code>{" "}
              to fit your design
            </div>
            <div>
              <span className="font-medium">Border:</span> Remove{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                border-radius
              </code>{" "}
              for square corners
            </div>
          </div>
        </GuideStep>
      </div>

      <WarningBanner
        message="Works on any website: WordPress, Wix, Squarespace, custom HTML sites, and more!"
        isDark={isDark}
      />
    </div>
  );
};
