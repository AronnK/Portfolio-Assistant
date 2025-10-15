"use client";
import { GuideStep } from "../shared/GuideStep";
import { CodeBlock } from "../shared/CodeBlock";
import { WarningBanner } from "../shared/WarningBanner";
import { ExternalLink } from "../shared/ExternalLink";

interface APIGuideProps {
  tempCollectionName: string;
  isDark: boolean;
}

export const APIGuide = ({ tempCollectionName, isDark }: APIGuideProps) => {
  const curlExample = `curl -X POST https://yourapp.com/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "collection_name": "${tempCollectionName}",
    "query": "Tell me about the projects",
    "provider_name": "google",
    "api_key": "your_api_key_here"
  }'`;

  const jsExample = `// JavaScript/TypeScript Example
const response = await fetch('https://yourapp.com/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    collection_name: '${tempCollectionName}',
    query: 'What skills does this person have?',
    provider_name: 'google',
    api_key: 'your_api_key_here'
  })
});

const data = await response.json();
console.log(data.answer);`;

  const pythonExample = `# Python Example
import requests

response = requests.post(
    'https://yourapp.com/api/chat',
    json={
        'collection_name': '${tempCollectionName}',
        'query': 'What are the main achievements?',
        'provider_name': 'google',
        'api_key': 'your_api_key_here'
    }
)

data = response.json()
print(data['answer'])`;

  return (
    <div className="space-y-6">
      <div>
        <h3
          className={`text-2xl font-bold mb-2 ${
            isDark ? "text-gray-100" : "text-slate-900"
          }`}
        >
          REST API Integration
        </h3>
        <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-600"}`}>
          Integrate your chatbot into custom applications
        </p>
      </div>

      <div className="space-y-4">
        <GuideStep
          stepNumber={1}
          title="API Endpoint"
          description="Make POST requests to this endpoint"
          isDark={isDark}
        >
          <div
            className={`p-4 rounded-lg ${
              isDark ? "bg-slate-950" : "bg-slate-100"
            }`}
          >
            <code
              className={`text-sm ${
                isDark ? "text-purple-400" : "text-indigo-600"
              }`}
            >
              POST https://yourapp.com/api/chat
            </code>
          </div>
        </GuideStep>

        <GuideStep
          stepNumber={2}
          title="cURL Example"
          description="Test your API using the command line"
          isDark={isDark}
          delay={0.1}
        >
          <CodeBlock code={curlExample} language="bash" isDark={isDark} />
        </GuideStep>

        <GuideStep
          stepNumber={3}
          title="JavaScript/TypeScript"
          description="Integrate into web or Node.js applications"
          isDark={isDark}
          delay={0.2}
        >
          <CodeBlock code={jsExample} language="javascript" isDark={isDark} />
        </GuideStep>

        <GuideStep
          stepNumber={4}
          title="Python Example"
          description="Use in Python applications or data science projects"
          isDark={isDark}
          delay={0.3}
        >
          <CodeBlock code={pythonExample} language="python" isDark={isDark} />
        </GuideStep>

        <GuideStep
          stepNumber={5}
          title="Response Format"
          description="The API returns JSON with the chatbot's answer"
          isDark={isDark}
          delay={0.4}
        >
          <CodeBlock
            code={`{
  "answer": "The chatbot's response text",
  "memory": {
    "exchanges": 2,
    "total_messages": 4
  }
}`}
            language="json"
            isDark={isDark}
          />
        </GuideStep>
      </div>

      <WarningBanner
        message="For production use, implement rate limiting and authentication. See our full API documentation for details."
        isDark={isDark}
      />
    </div>
  );
};
