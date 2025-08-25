/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { Tab } from '@headlessui/react';
import { CodeBracketIcon, ChatBubbleLeftIcon, PhotoIcon, UserIcon } from '@heroicons/react/24/outline';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
/* eslint-enable @typescript-eslint/ban-ts-comment */

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DocsPage() {
  const tabs = [
    {
      name: 'Overview',
      icon: CodeBracketIcon,
      content: (
        <div className="prose max-w-none dark:prose-invert">
          <h2>Introduction</h2>
          <p>
            The Serika.dev API provides a comprehensive set of endpoints for text generation,
            image generation, character interaction, and API management. Our API is compatible with
            OpenAI&apos;s format while offering additional features like character-based responses and
            advanced image generation models.
          </p>

          <h3>Authentication</h3>
          <p>
            The API uses bearer token authentication. Include your API key in the Authorization
            header of your requests:
          </p>
          <SyntaxHighlighter language="bash" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`curl https://api.serika.dev/api/openai/v1/chat/completions \\
  -H "Authorization: Bearer sk-your-api-key" \\
  -H "Content-Type: application/json"`}
          </SyntaxHighlighter>

          <h3>Base URL</h3>
          <p>All API requests should be made to:</p>
          <code className="block bg-gray-800 dark:bg-gray-900 text-white p-2 rounded">
            https://api.serika.dev/api/openai/v1
          </code>

          <h3>API Key Permissions</h3>
          <p>API keys have specific permissions that control access to different endpoints:</p>
          <ul>
            <li><code>text_generation</code> - Access to text generation endpoints</li>
            <li><code>image_generation</code> - Access to image generation endpoints</li>
            <li><code>character_info</code> - Access to character information</li>
            <li><code>user_info</code> - Access to user information</li>
            <li><code>unlinked_image_generation</code> - Generate images not linked to user profile</li>
          </ul>

          <h3>Rate Limits & Billing</h3>
          <p>
            Usage is metered based on tokens and images generated:
          </p>
          <ul>
            <li><strong>Tokens:</strong> €0.000007 per token</li>
            <li><strong>Images:</strong> €0.02 per image</li>
            <li><strong>Admin users:</strong> Usage tracked but not billed</li>
          </ul>
          <p>
            Different models have different token costs. Premium models require an active API subscription.
            Token usage includes both input and output tokens for text generation.
          </p>

          <h3>Error Handling</h3>
          <p>The API returns standard HTTP status codes and JSON error responses:</p>
          <SyntaxHighlighter language="json" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "error": {
    "message": "API key does not have image_generation permission",
    "type": "permission_error",
    "code": "insufficient_permissions",
    "param": "model"
  }
}`}
          </SyntaxHighlighter>
        </div>
      )
    },
    {
      name: 'Text Generation',
      icon: ChatBubbleLeftIcon,
      content: (
        <div className="prose max-w-none dark:prose-invert">
          <h2>Text Generation APIs</h2>
          <p>
            Generate text using advanced language models with support for streaming,
            character personas, custom system prompts, and conversation context.
          </p>

          <h3>Available Text Models</h3>
          <p>Use the <code>/models</code> endpoint to get the complete list of available models. Models are categorized by provider and access level:</p>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Example Models</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Access Level</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">OpenRouter</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">openai/gpt-4o, anthropic/claude-3-sonnet</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Premium</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">OpenAI</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">gpt-4o, gpt-4o-mini</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Premium</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Azure OpenAI</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">gpt-4o-deployment</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Premium</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>POST /v1/chat/completions</h3>
          <p>OpenAI-compatible chat completions endpoint with enhanced features:</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "messages": [
    {"role": "user", "content": "Hello, how are you?"}
  ],
  "model": "gpt-4o",
  "temperature": 0.7,
  "stream": false,
  "character_id": "character-uuid-here",
  "system_prompt": "You are a helpful AI assistant with expertise in programming."
}`}
          </SyntaxHighlighter>

          <h4>Parameters:</h4>
          <ul>
            <li><code>messages</code> (required): Array of message objects with role and content</li>
            <li><code>model</code> (optional): Model ID to use (default: gpt-4o)</li>
            <li><code>temperature</code> (optional): Randomness control (0.0-1.0, default: 0.7)</li>
            <li><code>stream</code> (optional): Enable streaming response (default: false)</li>
            <li><code>character_id</code> (optional): Use a specific character&apos;s personality</li>
            <li><code>system_prompt</code> (optional): Override or supplement character system prompt</li>
          </ul>

          <h3>POST /v1/responses</h3>
          <p>Alternative endpoint supporting both single input and conversation format:</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`// Single input format
{
  "input": "Explain quantum computing in simple terms",
  "model": "gpt-4o",
  "character_id": "science-teacher-id"
}

// Or conversation format
{
  "messages": [
    {"role": "user", "content": "What is quantum computing?"},
    {"role": "assistant", "content": "Quantum computing uses quantum mechanics..."},
    {"role": "user", "content": "How does it differ from classical computing?"}
  ],
  "model": "gpt-4o"
}`}
          </SyntaxHighlighter>

          <h3>POST /v1/generate/text (Legacy)</h3>
          <p>Legacy endpoint for text generation, maintained for backward compatibility.</p>

          <h3>Response Format</h3>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
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

          <h3>Streaming Responses</h3>
          <p>When <code>stream: true</code>, responses are sent as Server-Sent Events:</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1702587897,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}

data: {"id":"chatcmpl-123","object":"chat.completion.chunk","created":1702587897,"model":"gpt-4o","choices":[{"index":0,"delta":{"content":"!"},"finish_reason":"stop"}]}

data: [DONE]`}
          </SyntaxHighlighter>
        </div>
      )
    },
    {
      name: 'Image Generation',
      icon: PhotoIcon,
      content: (
        <div className="prose max-w-none dark:prose-invert">
          <h2>Image Generation API</h2>
          <p>
            Generate high-quality images using multiple providers including NovelAI, OpenAI DALL-E, and TensorArt.
            Supports various models, sizes, styles, negative prompts, and advanced parameters.
          </p>

          <h3>Available Image Models</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Model Examples</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Supported Sizes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Access Level</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">NovelAI</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">nai-diffusion-3, nai-diffusion-4-full</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">512x512 to 1024x1024</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">All Users</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">OpenAI</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">dall-e-3, gpt-image-1</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">1024x1024, 1792x1024</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Premium</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">TensorArt</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Custom fine-tuned models</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Various sizes</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Premium</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>POST /v1/images/generations</h3>
          <p>OpenAI-compatible image generation endpoint with enhanced parameters:</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "prompt": "A majestic dragon soaring through clouds at sunset, digital art",
  "model": "nai-diffusion-3",
  "n": 1,
  "size": "1024x1024",
  "negative_prompt": "blurry, low quality, watermark",
  "steps": 23,
  "scale": 10,
  "sampler": "k_dpmpp_2s_ancestral",
  "seed": 12345,
  "link_to_user": true
}`}
          </SyntaxHighlighter>

          <h4>Parameters:</h4>
          <ul>
            <li><code>prompt</code> (required): Text description of the desired image</li>
            <li><code>model</code> (optional): Image model to use (default: nai-diffusion-3)</li>
            <li><code>n</code> (optional): Number of images to generate (1-10, default: 1)</li>
            <li><code>size</code> (optional): Image dimensions (e.g., &quot;1024x1024&quot;)</li>
            <li><code>negative_prompt</code> (optional): Elements to avoid in the image</li>
            <li><code>steps</code> (optional): Number of generation steps (10-50)</li>
            <li><code>scale</code> (optional): CFG scale for prompt adherence (1-20)</li>
            <li><code>sampler</code> (optional): Sampling method</li>
            <li><code>seed</code> (optional): Seed for reproducible results</li>
            <li><code>link_to_user</code> (optional): Whether to link image to user profile</li>
          </ul>

          <h3>POST /v1/generate/image (Legacy)</h3>
          <p>Legacy endpoint for image generation, maintained for backward compatibility.</p>

          <h3>DELETE /v1/images/:imageId</h3>
          <p>Delete a generated image (only images you created):</p>
          <SyntaxHighlighter language="bash" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`curl -X DELETE https://api.serika.dev/api/openai/v1/images/your-image-id \\
  -H "Authorization: Bearer sk-your-api-key"`}
          </SyntaxHighlighter>

          <h3>Response Format</h3>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "created": 1702587897,
  "data": [
    {
      "url": "https://api.serika.dev/api/cdn/generated-image.png",
      "revised_prompt": "A majestic dragon soaring through clouds at sunset, digital art"
    }
  ],
  "model": "nai-diffusion-3",
  "usage": {
    "prompt_tokens": 15,
    "total_tokens": 15
  }
}`}
          </SyntaxHighlighter>

          <h3>Provider-Specific Features</h3>
          <h4>NovelAI Models</h4>
          <p>Support advanced parameters like dynamic thresholding, SMEA, and v4-specific features.</p>
          
          <h4>OpenAI Models</h4>
          <p>Support quality settings (standard/hd) and various aspect ratios.</p>
          
          <h4>TensorArt Models</h4>
          <p>Support LoRA fine-tuning and custom model variations with automatic fallback to NovelAI if unavailable.</p>
        </div>
      )
    },
    {
      name: 'Characters & Management',
      icon: UserIcon,
      content: (
        <div className="prose max-w-none dark:prose-invert">
          <h2>Characters API</h2>
          <p>
            Access and interact with Serika&apos;s character database. Characters provide personality,
            speaking style, and context to text generation requests.
          </p>

          <h3>GET /v1/characters</h3>
          <p>List all public characters (requires <code>character_info</code> permission):</p>
          <SyntaxHighlighter language="bash" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`curl https://api.serika.dev/api/openai/v1/characters \\
  -H "Authorization: Bearer sk-your-api-key"`}
          </SyntaxHighlighter>

          <h3>GET /v1/characters/:id</h3>
          <p>Get detailed information about a specific character:</p>
          <SyntaxHighlighter language="bash" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`curl https://api.serika.dev/api/openai/v1/characters/character-uuid \\
  -H "Authorization: Bearer sk-your-api-key"`}
          </SyntaxHighlighter>

          <h3>Character Response Format</h3>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "id": "character-uuid",
  "name": "Character Name",
  "description": "Brief character description",
  "avatar_url": "https://api.serika.dev/api/cdn/avatar.png",
  "created_at": "2024-01-01T00:00:00.000Z",
  "is_nsfw": false,
  "tags": ["anime", "friendly", "helpful"],
  "has_starter_message": true,
  "has_vrm": false,
  "vrm_link": null
}`}
          </SyntaxHighlighter>

          <h3>Using Characters in Text Generation</h3>
          <p>Include the <code>character_id</code> parameter in text generation requests:</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "messages": [
    {"role": "user", "content": "Hello! How are you today?"}
  ],
  "model": "gpt-4o",
  "character_id": "character-uuid",
  "temperature": 0.8
}`}
          </SyntaxHighlighter>

          <h2>API Key Management</h2>
          <p>Manage your API keys programmatically:</p>

          <h3>POST /v1/keys</h3>
          <p>Create a new API key (requires authentication):</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "name": "My Project Key"
}`}
          </SyntaxHighlighter>

          <h3>GET /v1/keys</h3>
          <p>List all API keys for your account</p>

          <h3>PUT /v1/keys/:id/permissions</h3>
          <p>Update API key permissions:</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "permissions": [
    "text_generation",
    "image_generation",
    "character_info"
  ]
}`}
          </SyntaxHighlighter>

          <h3>POST /v1/keys/:id/regenerate</h3>
          <p>Regenerate an API key while preserving metadata</p>

          <h3>PUT /v1/keys/:id/disable</h3>
          <p>Disable an API key (preserves usage history)</p>

          <h3>DELETE /v1/keys/:id</h3>
          <p>Permanently delete an API key and all usage history</p>

          <h2>Usage & Billing</h2>

          <h3>GET /v1/usage</h3>
          <p>Get detailed usage statistics:</p>
          <SyntaxHighlighter language="bash" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`curl "https://api.serika.dev/api/openai/v1/usage?startDate=2024-01-01&endDate=2024-01-31" \\
  -H "Authorization: Bearer your-session-token"`}
          </SyntaxHighlighter>

          <h3>POST /v1/billing/setup</h3>
          <p>Setup usage-based billing for API access</p>

          <h3>Usage Response Format</h3>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`{
  "summary": {
    "totalTokens": 50000,
    "totalImages": 25,
    "totalCost": 4.00,
    "pricing": {
      "tokens": 0.00007,
      "images": 0.02
    },
    "isAdmin": false
  },
  "byEndpoint": [
    {
      "_id": "/v1/chat/completions",
      "totalTokens": 35000,
      "totalImages": 0,
      "totalCost": 2.45
    },
    {
      "_id": "/v1/images/generations",
      "totalTokens": 15000,
      "totalImages": 25,
      "totalCost": 1.55
    }
  ]
}`}
          </SyntaxHighlighter>
        </div>
      )
    },
    {
      name: 'All Endpoints',
      icon: CodeBracketIcon,
      content: (
        <div className="prose max-w-none dark:prose-invert">
          <h2>Complete API Reference</h2>
          <p>
            Comprehensive list of all available endpoints in the Serika.dev API.
          </p>

          <h3>Core Information</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auth</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/models</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">GET</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">List all available models</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">API Key</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/characters</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">GET</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">List public characters</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">API Key</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/characters/:id</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">GET</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Get character details</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">API Key</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Text Generation</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/chat/completions</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">OpenAI-compatible chat completions</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/responses</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Alternative response endpoint</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/generate/text</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Legacy text generation endpoint</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Image Generation</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/images/generations</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">OpenAI-compatible image generation</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/generate/image</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Legacy image generation endpoint</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/images/:imageId</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">DELETE</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Delete generated image</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>API Key Management</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auth</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">GET</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">List all API keys</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Create new API key</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys/:id</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">GET</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Get API key details</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys/:id</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">DELETE</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Delete API key permanently</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys/:id/regenerate</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Regenerate API key</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys/:id/disable</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">PUT</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Disable API key</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys/:id/enable</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Enable API key</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/keys/:id/permissions</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">PUT</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Update API key permissions</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Usage & Billing</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Auth</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/usage</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">GET</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Get usage statistics</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/usage/report</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Report API usage (internal)</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">API Key</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/billing/setup</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">POST</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Setup usage-based billing</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Session</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Documentation</h3>
          <div className="not-prose">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">/v1/docs/completion</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">GET</td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Get completion API documentation</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Common Response Codes</h3>
          <ul>
            <li><code>200</code> - Success</li>
            <li><code>400</code> - Bad Request (invalid parameters)</li>
            <li><code>401</code> - Unauthorized (invalid API key)</li>
            <li><code>403</code> - Forbidden (insufficient permissions)</li>
            <li><code>404</code> - Not Found (resource doesn&apos;t exist)</li>
            <li><code>500</code> - Internal Server Error</li>
          </ul>

          <h3>SDKs and Libraries</h3>
          <p>The API is compatible with OpenAI SDKs. Simply change the base URL:</p>
          <SyntaxHighlighter language="javascript" style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any}>
            {`// JavaScript/Node.js
const OpenAI = require('openai');
const client = new OpenAI({
  apiKey: 'sk-your-api-key',
  baseURL: 'https://api.serika.dev/api/openai/v1'
});

# Python
from openai import OpenAI
client = OpenAI(
    api_key="sk-your-api-key",
    base_url="https://api.serika.dev/api/openai/v1"
)`}
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
            <div className="border-b border-gray-200 dark:border-gray-700">
              <Tab.List className="-mb-px flex space-x-8">
                {tabs.map((tab) => (
                  <Tab
                    key={tab.name}
                    className={({ selected }) =>
                      classNames(
                        'group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                        selected
                          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                          : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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