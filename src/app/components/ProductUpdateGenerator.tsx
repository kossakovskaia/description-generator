"use client";

import { useState } from "react";
import CopyButton from "./CopyButton";

export default function ProductUpdateGenerator() {
  const [epicsText, setEpicsText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const epics = epicsText
      .split("\n---\n")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/generate-product-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ epics }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.result);
      } else {
        setError(data.error);
      }
    } catch {
      setError("Failed to generate product update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Product Update Generator
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Epics (separate with --- on new lines) *
          </label>
          <textarea
            value={epicsText}
            onChange={(e) => setEpicsText(e.target.value)}
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white font-mono text-sm"
            placeholder="EPIC 1 description&#10;---&#10;EPIC 2 description&#10;---&#10;EPIC 3 description"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          {loading ? "Generating..." : "Generate Product Update"}
        </button>
      </form>

      {error && (
        <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
          <p className="text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      {result && (
        <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated Product Update
            </h3>
            <CopyButton text={result} />
          </div>
          <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}
