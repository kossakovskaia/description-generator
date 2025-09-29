"use client";

import { useState } from "react";
import EpicGenerator from "./components/EpicGenerator";
import JpdIdeaGenerator from "./components/JpdIdeaGenerator";
import ProductUpdateGenerator from "./components/ProductUpdateGenerator";

type Tab = "epic" | "jpd" | "product-update";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("epic");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Description Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            AI-powered tools for generating epics, JPD ideas, and product updates
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("epic")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "epic"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Epic Generator
            </button>
            <button
              onClick={() => setActiveTab("jpd")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "jpd"
                  ? "bg-green-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              JPD Idea
            </button>
            <button
              onClick={() => setActiveTab("product-update")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "product-update"
                  ? "bg-purple-600 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              Product Update
            </button>
          </div>

          <div className="p-6">
            {activeTab === "epic" && <EpicGenerator />}
            {activeTab === "jpd" && <JpdIdeaGenerator />}
            {activeTab === "product-update" && <ProductUpdateGenerator />}
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>
            Powered by OpenAI GPT-4.{" "}
            {!process.env.NEXT_PUBLIC_HAS_API_KEY && (
              <span className="text-yellow-600 dark:text-yellow-400">
                (Running in mock mode - set OPENAI_API_KEY to enable real generation)
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}