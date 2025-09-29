"use client";

import { useState } from "react";

type EpicResult = 
  | { type: 'error'; error: string }
  | { type: 'text'; text: string }
  | { type: 'full'; text: string; json: unknown }
  | null;

export default function EpicGenerator() {
  const [idea, setIdea] = useState("");
  const [overview, setOverview] = useState("");
  const [organizations, setOrganizations] = useState("");
  const [environments, setEnvironments] = useState("");
  const [includeJson, setIncludeJson] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EpicResult>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/generate-epic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea,
          overview,
          organizations: organizations.split(",").map((s) => s.trim()).filter(Boolean),
          environments: environments.split(",").map((s) => s.trim()).filter(Boolean),
          json: includeJson,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const apiResult = data.result;
        if (typeof apiResult === 'string') {
          setResult({ type: 'text', text: apiResult });
        } else if (apiResult.text && apiResult.json) {
          setResult({ type: 'full', text: apiResult.text, json: apiResult.json });
        } else {
          setResult({ type: 'text', text: apiResult.text || apiResult });
        }
      } else {
        setResult({ type: 'error', error: data.error });
      }
    } catch {
      setResult({ type: 'error', error: "Failed to generate epic" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Epic Generator
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Idea *
          </label>
          <input
            type="text"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Short idea..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            High-Level Overview *
          </label>
          <textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Detailed overview..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Organizations (comma-separated)
          </label>
          <input
            type="text"
            value={organizations}
            onChange={(e) => setOrganizations(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Org1, Org2, Org3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Environments (comma-separated)
          </label>
          <input
            type="text"
            value={environments}
            onChange={(e) => setEnvironments(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="Dev, Staging, Production"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="includeJson"
            checked={includeJson}
            onChange={(e) => setIncludeJson(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="includeJson"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Include JSON output
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? "Generating..." : "Generate Epic"}
        </button>
      </form>

      {result && (
        <div className="mt-6">
          {result.type === 'error' ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <p className="text-red-800 dark:text-red-300">{result.error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Generated Epic
                </h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                  {result.text}
                </pre>
              </div>
              {result.type === 'full' && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    JSON Output
                  </h3>
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {JSON.stringify(result.json, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
