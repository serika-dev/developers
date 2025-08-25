/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import Card from '@/app/components/ui/Card';
import { Toaster, toast } from 'sonner';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Tab } from '@headlessui/react';
import { getModels, generateText, generateImage, getCharacters, setStoredApiKey, getStoredApiKey } from '@/app/services/api';
import { Model, Character, GenerationRequest, ImageGenerationRequest } from '@/app/types';
import { ArrowPathIcon, KeyIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import Editor from '@monaco-editor/react';
import Image from 'next/image';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import SyntaxHighlighter from 'react-syntax-highlighter';
/* eslint-enable @typescript-eslint/ban-ts-comment */

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function PlaygroundPage() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [apiKey, setApiKeyLocal] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [selectedCharacter, setSelectedCharacter] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Say hello and introduce yourself briefly.' }
  ]);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [stream, setStream] = useState(false);
  
  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('A beautiful sunset over mountains');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [imageModel, setImageModel] = useState('nai-diffusion-3');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [steps, setSteps] = useState(23);
  const [scale, setScale] = useState(10);
  const [sampler, setSampler] = useState('k_dpmpp_2s_ancestral');
  const [seed, setSeed] = useState(Math.floor(Math.random() * 4294967295));
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  
  // Code example state
  const [language, setLanguage] = useState('javascript');
  const codeExamples = {
    javascript: `const axios = require('axios');\n\n...`,
    python: `import requests\n\n...`,
    curl: `curl -X POST ...`,
  };

  useEffect(() => {
    // Check if an API key is already set
    const savedApiKey = getStoredApiKey();
    if (savedApiKey) {
      setApiKeyLocal(savedApiKey);
      
      // Fetch models and characters
      fetchModels();
      fetchCharacters();
    }
  }, []);

  const fetchModels = async () => {
    try {
      const modelsResponse = await getModels();
      setModels(modelsResponse.data);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to fetch available models');
    }
  };

  const fetchCharacters = async () => {
    try {
      const charactersData = await getCharacters();
      setCharacters(charactersData);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast.error('Please enter a valid API key');
      return;
    }
    
    // Store API key using our service function
    setStoredApiKey(apiKey);
    toast.success('API key saved successfully');
    
    // Fetch models and characters with the new API key
    fetchModels();
    fetchCharacters();
  };

  const handleGenerateText = async () => {
    if (!getStoredApiKey()) {
      toast.error('Please set your API key first');
      return;
    }

    if (messages.length === 0 || !messages[0].content.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    setResponse('');
    
    try {
      const request: GenerationRequest = {
        messages,
        model: selectedModel,
        stream,
        temperature,
      };
      
      // Add character_id if selected
      if (selectedCharacter) {
        request.character_id = selectedCharacter;
      }
      
      // Add system prompt if provided
      if (systemPrompt.trim()) {
        request.system_prompt = systemPrompt;
      }
      
      if (stream) {
        // Handle streaming not implemented in this simplified example
        toast.error('Streaming is not implemented in this demo');
        setLoading(false);
        return;
      } else {
        const data = await generateText(request);
        setResponse(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error generating text:', error);
      toast.error('Failed to generate text. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!getStoredApiKey()) {
      toast.error('Please set your API key first');
      return;
    }

    if (!imagePrompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }

    setLoading(true);
    setGeneratedImage(null);
    
    try {
      const request: ImageGenerationRequest = {
        prompt: imagePrompt,
        model: imageModel,
        size: imageSize,
        negative_prompt: negativePrompt,
        steps,
        scale,
        sampler,
        seed,
      };
      
      const data = await generateImage(request);
      if (data && data.data && data.data.length > 0) {
        setGeneratedImage(data.data[0].url);
      } else {
        toast.error('No image was generated');
      }
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMessagesEditorValue = () => {
    return JSON.stringify(messages, null, 2);
  };

  const updateMessages = (value: string | undefined) => {
    try {
      if (value) {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
        }
      }
    } catch (error) {
      // Don't update if JSON is invalid
      console.error('Invalid JSON:', error);
    }
  };

  return (
    <DashboardLayout title="API Playground">
      <Toaster position="top-right" theme={theme} />
      <div className="max-w-7xl mx-auto pb-6">
        <div className="mb-6">
          <Card title="API Key">
            <div className="flex items-center space-x-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="sk-your-api-key"
                  value={apiKey}
                  onChange={(e) => setApiKeyLocal(e.target.value)}
                />
              </div>
              <button
                onClick={handleSaveApiKey}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Key
              </button>
            </div>
          </Card>
        </div>
        
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex rounded-xl bg-gray-100 dark:bg-gray-800 p-1">
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-gray-900 shadow text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] dark:hover:bg-gray-700/[0.12] hover:text-gray-700 dark:hover:text-gray-300'
                )
              }
            >
              Text Generation
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-gray-900 shadow text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] dark:hover:bg-gray-700/[0.12] hover:text-gray-700 dark:hover:text-gray-300'
                )
              }
            >
              Image Generation
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white dark:bg-gray-900 shadow text-indigo-700 dark:text-indigo-400'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] dark:hover:bg-gray-700/[0.12] hover:text-gray-700 dark:hover:text-gray-300'
                )
              }
            >
              Code Examples
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-6">
            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card title="Model & Parameters">
                    <div className="space-y-4">
                      {/* Model Selection */}
                      <div>
                        <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                          Model
                        </label>
                        <select
                          id="model"
                          name="model"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={selectedModel}
                          onChange={(e) => setSelectedModel(e.target.value)}
                        >
                          {models.length > 0 ? (
                            models.map((model) => (
                              <option key={model.id} value={model.id}>
                                {model.id} {model.description ? `- ${model.description}` : ''}
                              </option>
                            ))
                          ) : (
                            <option value="gpt-4o">gpt-4o</option>
                          )}
                        </select>
                      </div>
                      
                      {/* Character Selection */}
                      <div>
                        <label htmlFor="character" className="block text-sm font-medium text-gray-700">
                          Character (Optional)
                        </label>
                        <select
                          id="character"
                          name="character"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={selectedCharacter}
                          onChange={(e) => setSelectedCharacter(e.target.value)}
                        >
                          <option value="">None</option>
                          {characters.map((character) => (
                            <option key={character.id} value={character.id}>
                              {character.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Temperature Slider */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Temperature: {temperature}
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={temperature}
                          onChange={(e) => setTemperature(parseFloat(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>More deterministic</span>
                          <span>More creative</span>
                        </div>
                      </div>
                      
                      {/* System Prompt */}
                      <div>
                        <label htmlFor="system-prompt" className="block text-sm font-medium text-gray-700">
                          System Prompt (Optional)
                        </label>
                        <textarea
                          id="system-prompt"
                          rows={3}
                          className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Custom system instructions..."
                          value={systemPrompt}
                          onChange={(e) => setSystemPrompt(e.target.value)}
                        />
                      </div>
                      
                      {/* Streaming Toggle - Disabled for simplicity */}
                      <div className="flex items-center">
                        <input
                          id="stream"
                          name="stream"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={stream}
                          onChange={(e) => setStream(e.target.checked)}
                          disabled
                        />
                        <label htmlFor="stream" className="ml-2 block text-sm text-gray-900 dark:text-white">
                          Enable Streaming (Not implemented in this demo)
                        </label>
                      </div>
                    </div>
                  </Card>
                  
                  <Card title="Messages">
                    <div className="h-64">
                      <Editor
                        height="100%"
                        language="json"
                        value={getMessagesEditorValue()}
                        onChange={updateMessages}
                        options={{
                          minimap: { enabled: false },
                          scrollBeyondLastLine: false,
                        }}
                      />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleGenerateText}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Generating...
                          </>
                        ) : (
                          'Generate Response'
                        )}
                      </button>
                    </div>
                  </Card>
                </div>
                
                <Card title="Response">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                      <span className="ml-2">Generating response...</span>
                    </div>
                  ) : response ? (
                    <div className="h-[calc(100vh-350px)] overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-md">
                      <div className="prose max-w-none dark:prose-invert">
                        {response.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            <br />
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Response will appear here after generation
                    </div>
                  )}
                </Card>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <Card title="Image Parameters">
                    <div className="space-y-4">
                      {/* Image Prompt */}
                      <div>
                        <label htmlFor="image-prompt" className="block text-sm font-medium text-gray-700">
                          Prompt
                        </label>
                        <textarea
                          id="image-prompt"
                          rows={3}
                          className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe the image you want to generate..."
                          value={imagePrompt}
                          onChange={(e) => setImagePrompt(e.target.value)}
                        />
                      </div>
                      
                      {/* Negative Prompt */}
                      <div>
                        <label htmlFor="negative-prompt" className="block text-sm font-medium text-gray-700">
                          Negative Prompt (Optional)
                        </label>
                        <textarea
                          id="negative-prompt"
                          rows={2}
                          className="mt-1 block w-full sm:text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Elements to avoid in the image..."
                          value={negativePrompt}
                          onChange={(e) => setNegativePrompt(e.target.value)}
                        />
                      </div>
                      
                      {/* Model Selection */}
                      <div>
                        <label htmlFor="image-model" className="block text-sm font-medium text-gray-700">
                          Model
                        </label>
                        <select
                          id="image-model"
                          name="image-model"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={imageModel}
                          onChange={(e) => setImageModel(e.target.value)}
                        >
                          <option value="nai-diffusion-3">NAI Diffusion 3</option>
                          <option value="nai-diffusion-4-full">NAI Diffusion 4</option>
                        </select>
                      </div>
                      
                      {/* Size Selection */}
                      <div>
                        <label htmlFor="image-size" className="block text-sm font-medium text-gray-700">
                          Size
                        </label>
                        <select
                          id="image-size"
                          name="image-size"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={imageSize}
                          onChange={(e) => setImageSize(e.target.value)}
                        >
                          <option value="1024x1024">1024x1024</option>
                          <option value="768x768">768x768</option>
                          <option value="512x512">512x512</option>
                          <option value="832x1216">832x1216 (For NAI Diffusion 4)</option>
                        </select>
                      </div>
                      
                      {/* Advanced Parameters */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="steps" className="block text-sm font-medium text-gray-700">
                            Steps: {steps}
                          </label>
                          <input
                            type="range"
                            id="steps"
                            min="10"
                            max="50"
                            value={steps}
                            onChange={(e) => setSteps(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="scale" className="block text-sm font-medium text-gray-700">
                            CFG Scale: {scale}
                          </label>
                          <input
                            type="range"
                            id="scale"
                            min="1"
                            max="20"
                            value={scale}
                            onChange={(e) => setScale(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="sampler" className="block text-sm font-medium text-gray-700">
                            Sampler
                          </label>
                          <select
                            id="sampler"
                            name="sampler"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={sampler}
                            onChange={(e) => setSampler(e.target.value)}
                          >
                            <option value="k_dpmpp_2s_ancestral">k_dpmpp_2s_ancestral</option>
                            <option value="k_dpmpp_2m">k_dpmpp_2m</option>
                            <option value="k_euler_ancestral">k_euler_ancestral</option>
                            <option value="k_euler">k_euler</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="seed" className="block text-sm font-medium text-gray-700">
                            Seed
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="number"
                              id="seed"
                              name="seed"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                              value={seed}
                              onChange={(e) => setSeed(parseInt(e.target.value))}
                            />
                            <button
                              type="button"
                              onClick={() => setSeed(Math.floor(Math.random() * 4294967295))}
                              className="ml-1 inline-flex items-center p-1 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleGenerateImage}
                        disabled={loading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? (
                          <>
                            <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Generating...
                          </>
                        ) : (
                          'Generate Image'
                        )}
                      </button>
                    </div>
                  </Card>
                </div>
                
                <Card title="Generated Image">
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
                      <span className="ml-2">Generating image...</span>
                    </div>
                  ) : generatedImage ? (
                    <div className="flex justify-center py-2">
                      <div className="relative">
                        <Image
                          src={generatedImage}
                          alt="Generated"
                          width={600}
                          height={600}
                          className="max-w-full max-h-[600px] rounded-md shadow-md"
                        />
                        <a
                          href={generatedImage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 p-1 rounded-md shadow-sm"
                          title="View full size"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      Image will appear here after generation
                    </div>
                  )}
                </Card>
              </div>
            </Tab.Panel>
            
            <Tab.Panel>
              <Card title="Code Examples">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                      Language
                    </label>
                    <select
                      id="language"
                      name="language"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="javascript">JavaScript (Node.js)</option>
                      <option value="python">Python</option>
                      <option value="curl">cURL</option>
                    </select>
                  </div>
                  
                  <div className="bg-gray-800 dark:bg-gray-900 rounded-md overflow-hidden">
                    <SyntaxHighlighter language={language} style={{backgroundColor: '#1e1e1e', color: '#f8f8f2', padding: '1rem', borderRadius: '0.5rem'} as any} showLineNumbers>
                      {codeExamples[language as keyof typeof codeExamples]}
                    </SyntaxHighlighter>
                    <div className="flex justify-end p-2 bg-gray-700 dark:bg-gray-800">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(codeExamples[language as keyof typeof codeExamples]);
                          toast.success('Code copied to clipboard');
                        }}
                        className="text-sm text-gray-200 hover:text-white flex items-center"
                      >
                        <ClipboardIcon className="h-4 w-4 mr-1" />
                        Copy
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose max-w-none dark:prose-invert">
                    <h3>API Endpoints</h3>
                    <p>
                      The Serika.dev API provides endpoints for text generation, image generation, and more.
                      Here are the main endpoints you can use:
                    </p>
                    <ul>
                      <li><code>/v1/chat/completions</code> - Generate text completions</li>
                      <li><code>/v1/images/generations</code> - Generate images</li>
                      <li><code>/v1/models</code> - List available models</li>
                      <li><code>/v1/characters</code> - List available characters</li>
                    </ul>
                    
                    <h3>Authentication</h3>
                    <p>
                      All API requests must include your API key in an Authorization header:
                    </p>
                    <pre className="bg-gray-100 p-2 rounded-md">
                      <code>Authorization: Bearer your_api_key</code>
                    </pre>
                    
                    <h3>Additional Resources</h3>
                    <p>
                      Check out the <a href="/dashboard/docs" className="text-indigo-600 hover:text-indigo-800">full documentation</a> for more details on all available API endpoints.
                    </p>
                  </div>
                </div>
              </Card>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </DashboardLayout>
  );
} 