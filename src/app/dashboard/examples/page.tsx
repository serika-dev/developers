'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { Tab } from '@headlessui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import atomDark from 'react-syntax-highlighter/dist/esm/styles/prism/atom-dark';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function ExamplesPage() {
  const examples = {
    javascript: {
      name: 'JavaScript',
      code: `const axios = require('axios');

const API_KEY = 'your_api_key'; // Replace with your API key
const API_URL = 'https://beta-api.serika.dev/api/openai/v1';

async function generateText() {
  try {
    const response = await axios.post(
      \`\${API_URL}/chat/completions\`,
      {
        messages: [
          { role: 'user', content: 'Hello, how are you?' }
        ],
        model: 'gpt-4o'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${API_KEY}\`
        }
      }
    );
    
    console.log(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

generateText();`,
    },
    python: {
      name: 'Python',
      code: `import requests

API_KEY = 'your_api_key'  # Replace with your API key
API_URL = 'https://beta-api.serika.dev/api/openai/v1'

def generate_text():
    try:
        response = requests.post(
            f"{API_URL}/chat/completions",
            json={
                "messages": [
                    {"role": "user", "content": "Hello, how are you?"}
                ],
                "model": "gpt-4o"
            },
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {API_KEY}"
            }
        )
        
        response.raise_for_status()
        data = response.json()
        print(data["choices"][0]["message"]["content"])
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

generate_text()`,
    },
    curl: {
      name: 'cURL',
      code: `curl -X POST https://beta-api.serika.dev/api/openai/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer your_api_key" \\
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "model": "gpt-4o"
  }'`,
    },
  };

  return (
    <DashboardLayout title="Code Examples">
      <div className="max-w-7xl mx-auto pb-6">
        <Card>
          <Tab.Group>
            <Tab.List className="flex space-x-1 border-b border-gray-200 dark:border-gray-700 px-6">
              {Object.values(examples).map((example) => (
                <Tab
                  key={example.name}
                  className={({ selected }) =>
                    classNames(
                      'py-4 px-6 text-sm font-medium',
                      'focus:outline-none',
                      selected
                        ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    )
                  }
                >
                  {example.name}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels>
              {Object.values(examples).map((example) => (
                <Tab.Panel key={example.name} className="p-6">
                  <div className="prose max-w-none">
                    <h3>Example using {example.name}</h3>
                    <p>This example demonstrates how to make a simple text generation request using {example.name}.</p>
                  </div>
                  <div className="mt-4 relative">
                    <SyntaxHighlighter
                      language={example.name.toLowerCase()}
                      style={atomDark}
                      customStyle={{ margin: 0 }}
                    >
                      {example.code}
                    </SyntaxHighlighter>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(example.code);
                        // You can add a toast notification here
                      }}
                      className="absolute top-4 right-4 p-2 bg-gray-800 dark:bg-gray-700 rounded text-gray-300 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    </button>
                  </div>
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </div>
    </DashboardLayout>
  );
} 