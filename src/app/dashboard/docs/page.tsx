'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { Tab } from '@headlessui/react';
import { CodeBracketIcon, ChatBubbleLeftIcon, PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DocsPage() {
  const tabs = [
    {
      name: 'Overview',
      icon: CodeBracketIcon,
      content: (
        <div className="prose max-w-none">
          <h2>Introduction</h2>
          <p>
            The Serika.dev API provides a comprehensive set of endpoints for text generation,
            image generation, and character interaction. Our API is designed to be easy to use
            while providing powerful AI capabilities.
          </p>

          <h3>Authentication</h3>
          <p>
            The API uses bearer token authentication. Include your API key in the Authorization
            header of your requests:
          </p>
          <SyntaxHighlighter language="bash" style={atomDark}>
            {`curl https://beta-api.serika.dev/api/openai/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json"`}
          </SyntaxHighlighter>

          <h3>Base URL</h3>
          <p>All API requests should be made to:</p>
          <code className="block bg-gray-800 text-white p-2 rounded">
            https://beta-api.serika.dev/api/openai/v1
          </code>

          <h3>Rate Limits & Billing</h3>
          <p>
            Rate limits and pricing are based on your subscription tier:
          </p>
          <ul>
            <li>Free tier: 60 requests per minute, limited model access</li>
            <li>Premium tier: 120 requests per minute, full model access</li>
          </ul>
          <p>
            Token usage is metered and billed based on your subscription plan. Image generation
            counts as 1000 tokens per image.
          </p>
        </div>
      )
    },
    {
      name: 'Chat Completions',
      icon: ChatBubbleLeftIcon,
      content: (
        <div className="prose max-w-none">
          <h2>Chat Completions API</h2>
          <p>
            Create chat completions with our advanced language models. Supports streaming,
            character personas, and custom system prompts.
          </p>

          <h3>Available Models</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Tokens</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">gpt-4o</td>
                  <td className="px-6 py-4 text-sm text-gray-500">OpenRouter</td>
                  <td className="px-6 py-4 text-sm text-gray-500">8K</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Premium</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">gemini-2.0-flash</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Zuki Journey</td>
                  <td className="px-6 py-4 text-sm text-gray-500">4K</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Free</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Endpoint: POST /chat/completions</h3>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "model": "gpt-4o",
  "temperature": 0.7,
  "stream": false,
  "character_id": "optional-character-id",
  "system_prompt": "Optional system instructions"
}`}
          </SyntaxHighlighter>

          <h3>Response Format</h3>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`{
  "id": "chatcmpl-123abc",
  "object": "chat.completion",
  "created": 1702587897,
  "model": "gpt-4o",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! I&apos;m doing well, thank you for asking. How can I help you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 15,
    "total_tokens": 25
  }
}`}
          </SyntaxHighlighter>
        </div>
      )
    },
    {
      name: 'Image Generation',
      icon: PhotoIcon,
      content: (
        <div className="prose max-w-none">
          <h2>Image Generation API</h2>
          <p>
            Generate high-quality images using NovelAI&apos;s advanced image models. Supports
            various sizes, styles, and negative prompts.
          </p>

          <h3>Available Models</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sizes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">nai-diffusion-3</td>
                  <td className="px-6 py-4 text-sm text-gray-500">High-quality image generation</td>
                  <td className="px-6 py-4 text-sm text-gray-500">512x512, 768x768, 1024x1024</td>
                  <td className="px-6 py-4 text-sm text-gray-500">All</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">nai-diffusion-4-full</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Latest model with enhanced capabilities</td>
                  <td className="px-6 py-4 text-sm text-gray-500">832x1216</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Premium</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Endpoint: POST /images/generations</h3>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`{
  "prompt": "A beautiful sunset over mountains",
  "model": "nai-diffusion-3",
  "size": "1024x1024",
  "negative_prompt": "blurry, low quality",
  "steps": 23,
  "scale": 10,
  "sampler": "k_dpmpp_2s_ancestral",
  "seed": 12345
}`}
          </SyntaxHighlighter>

          <h3>Response Format</h3>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`{
  "created": 1702587897,
  "data": [
    {
      "url": "https://beta-api.serika.dev/api/cdn/generated-image.png",
      "revised_prompt": "A beautiful sunset over mountains"
    }
  ]
}`}
          </SyntaxHighlighter>
        </div>
      )
    },
    {
      name: 'Characters',
      icon: UserIcon,
      content: (
        <div className="prose max-w-none">
          <h2>Characters API</h2>
          <p>
            Access and interact with Serika&apos;s character database. Get character information
            and use them in chat completions.
          </p>

          <h3>Character Object</h3>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`{
  "id": "character-uuid",
  "name": "Character Name",
  "description": "Short description",
  "avatar": "https://beta-api.serika.dev/api/cdn/avatar.png",
  "creator": "username",
  "createdOn": "2024-01-01T00:00:00.000Z",
  "tags": ["tag1", "tag2"],
  "isNSFW": false
}`}
          </SyntaxHighlighter>

          <h3>Endpoints</h3>
          <h4>GET /characters</h4>
          <p>List all public characters</p>

          <h4>GET /characters/:id</h4>
          <p>Get detailed information about a specific character</p>

          <h3>Using Characters in Chat</h3>
          <p>
            Here&apos;s how to use characters in chat completions by providing their ID in the
            character_id parameter:
          </p>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {`{
  "messages": [
    {"role": "user", "content": "Hello!"}
  ],
  "model": "gpt-4o",
  "character_id": "character-uuid"
}`}
          </SyntaxHighlighter>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout title="API Documentation">
      <div className="max-w-7xl mx-auto pb-6">
        <Card>
          <Tab.Group>
            <div className="border-b border-gray-200">
              <Tab.List className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                        selected
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      )
                    }
                  >
                    <tab.icon
                      className="mr-2 h-5 w-5"
                      aria-hidden="true"
                    />
                    <span>{tab.name}</span>
                  </Tab>
                ))}
              </Tab.List>
            </div>
            <Tab.Panels className="mt-4">
              {tabs.map((tab, idx) => (
                <Tab.Panel
                  key={idx}
                  className={classNames(
                    'p-4',
                    'focus:outline-none'
                  )}
                >
                  {tab.content}
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>
        </Card>
      </div>
    </DashboardLayout>
  );
} 