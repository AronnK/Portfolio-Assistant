"use client";
import { GuideStep } from "../shared/GuideStep";
import { CodeBlock } from "../shared/CodeBlock";
import { WarningBanner } from "../shared/WarningBanner";

interface WidgetGuideProps {
  tempCollectionName: string;
  isDark: boolean;
}

export const WidgetGuide = ({
  tempCollectionName,
  isDark,
}: WidgetGuideProps) => {
  const widgetCode = `<!-- Add before closing </body> tag -->
<script src="https://yourapp.com/widget.js"></script>
<script>
  PortfolioWidget.init({
    chatbotId: '${tempCollectionName}',
    position: 'bottom-right',
    primaryColor: '#6366f1',
    buttonText: 'Chat with us'
  });
</script>`;

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-gray-100" : "text-slate-900"
          }`}
        >
          Chat Widget
        </h3>
        <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-600"}`}>
          Add a floating chat bubble to your website
        </p>
      </div>

      <div className="space-y-4">
        <GuideStep
          stepNumber={1}
          title="Copy the Widget Code"
          description="This creates a floating chat button on your site"
          isDark={isDark}
        >
          <CodeBlock code={widgetCode} language="javascript" isDark={isDark} />
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="Add to Your Website"
          description="Paste this code just before the closing </body> tag"
          isDark={isDark}
          delay={0.1}
        >
          <ul
            className={`space-y-2 text-sm ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            <li>• Open your website's HTML or theme editor</li>
            <li>• Scroll to the bottom of the page</li>
            <li>
              • Find the closing{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >{`</body>`}</code>{" "}
              tag
            </li>
            <li>• Paste the widget code just above it</li>
            <li>• Save your changes</li>
          </ul>
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="Customize Appearance"
          description="Adjust the widget to match your brand"
          isDark={isDark}
          delay={0.2}
        >
          <div
            className={`space-y-3 text-sm ${
              isDark ? "text-gray-400" : "text-slate-600"
            }`}
          >
            <div>
              <span className="font-medium">Position:</span>{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                bottom-right
              </code>
              ,{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                bottom-left
              </code>
              ,{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                top-right
              </code>
              , or{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                top-left
              </code>
            </div>
            <div>
              <span className="font-medium">Color:</span> Change{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                primaryColor
              </code>{" "}
              to any hex color
            </div>
            <div>
              <span className="font-medium">Button Text:</span> Customize{" "}
              <code
                className={`px-2 py-0.5 rounded ${
                  isDark ? "bg-slate-800" : "bg-slate-200"
                }`}
              >
                buttonText
              </code>{" "}
              to your preference
            </div>
          </div>
        </GuideStep>
      </div>

      <WarningBanner
        message="The widget automatically adapts to mobile screens and doesn't interfere with your site's functionality!"
        isDark={isDark}
      />
    </div>
  );
};
