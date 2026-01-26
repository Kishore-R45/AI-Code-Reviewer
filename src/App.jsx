import React, { useState } from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import Editor from "@monaco-editor/react";
import Select from "react-select";
import OpenAI from "openai";
import Markdown from "react-markdown";
import SyncLoader from "react-spinners/SyncLoader";

const App = () => {
  const options = [
    { value: "javascript", label: "JavaScript" },
    { value: "c", label: "C" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
    { value: "php", label: "PHP" },
    { value: "ruby", label: "Ruby" },
    { value: "go", label: "Go" },
    { value: "swift", label: "Swift" },
    { value: "kotlin", label: "Kotlin" },
    { value: "typescript", label: "TypeScript" },
    { value: "rust", label: "Rust" },
    { value: "dart", label: "Dart" },
    { value: "scala", label: "Scala" },
    { value: "perl", label: "Perl" },
    { value: "haskell", label: "Haskell" },
    { value: "elixir", label: "Elixir" },
    { value: "r", label: "R" },
    { value: "matlab", label: "MATLAB" },
    { value: "bash", label: "Bash" },
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#18181b",
      borderColor: "#3f3f46",
      color: "#fff",
      width: "100%",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#18181b",
      color: "#fff",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#27272a" : "#18181b",
      color: "#fff",
      cursor: "pointer",
    }),
  };
  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  async function reviewCode() {
    if (!code) {
      alert("Please enter code first");
      return;
    }

    setResponse("");
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert-level software developer.",
          },
          {
            role: "user",
            content: `Review this ${selectedOption.value} code and provide:
- Rating
- Improvements
- Potential bugs
- Fix suggestions

Code:
${code}`,
          },
        ],
      });

      const resultText = completion.choices[0]?.message?.content || "No response generated";
      setResponse(resultText);
    } catch (err) {
      setResponse("Error while reviewing code: " + err.message);
    }

    setLoading(false);
  }

  async function fixCode() {
    if (!code) {
      alert("Please enter code first");
      return;
    }

    setResponse("");
    setLoading(true);

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are an expert-level software developer. Fix the code and return ONLY the corrected code without any explanations or markdown formatting.",
          },
          {
            role: "user",
            content: `Fix the following ${selectedOption.value} code:

${code}`,
          },
        ],
      });

      const fixedText = completion.choices[0]?.message?.content || code;
      setCode(fixedText);
      setResponse("✅ Code fixed successfully!");
    } catch (err) {
      setResponse("Error while fixing code: " + err.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <div
        className="main flex justify-between"
        style={{ height: "calc(100vh - 75px)" }}
      >
        <div className="left h-[87.5%] w-[50%]">
          <div className="tabs mt-5 px-5 mb-3 flex gap-[10px]">
            <Select
              value={selectedOption}
              onChange={setSelectedOption}
              options={options}
              styles={customStyles}
            />

            <button
              onClick={fixCode}
              className="btnNormal bg-zinc-700 min-w-[120px]"
              style={{ border: "1px solid gray" }}
            >
              Fix Code
            </button>

            <button
              onClick={reviewCode}
              className="btnNormal bg-zinc-700 min-w-[120px]"
              style={{ border: "1px solid gray" }}
            >
              Review
            </button>
          </div>

          <Editor
            height="100%"
            theme="vs-dark"
            language={selectedOption.value}
            value={code}
            onChange={(v) => setCode(v)}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              placeholder: "# write or paste your code here",
            }}
          />
        </div>

        <div className="right bg-zinc-900 w-[50%] h-[101%] p-5 overflow-scroll relative">
          <div className="topTab border-b border-[#27272a] h-[60px] flex items-center justify-between">
            <p className="font-bold text-[17px]">Response</p>
          </div>

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60">
              <SyncLoader color="#9333ea" />
            </div>
          )}

          <Markdown>{response}</Markdown>
        </div>
      </div>
    </>
  );
};

export default App;
