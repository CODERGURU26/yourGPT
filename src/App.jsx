import React, { useState } from 'react'
import { AiOutlineSend } from "react-icons/ai"
import { URL } from './contants'
import Answers from './components/Answers'

const App = () => {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false)

  const askQuestion = async () => {
    if (!question.trim()) return
    setLoading(true)
    try {
      const res = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: question
                }
              ]
            }
          ]
        })
      })

      const data = await res.json()
      let responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text
      responseText = responseText.split('* ').map(item => item.trim()).filter(Boolean)
      setResult(prev => [
        ...prev,
        { type: 'q', text: question },
        { type: 'a', text: responseText }
      ]);

      setQuestion('');
    } catch (err) {
      console.error("API Error:", err);
      setResult(prev => [...prev, { type: 'a', text: ["Error: Could not fetch response."] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full grid grid-cols-5 bg-zinc-900 text-zinc-300">
      {/* Sidebar */}
      <div className="col-span-1 bg-zinc-800 p-4">
        <h2 className="text-lg font-semibold mb-4">Gemini AI</h2>
      </div>

      {/* Main Content */}
      <div className="col-span-4 flex flex-col justify-between h-full p-6">
        {/* Output Section */}
        <div className="overflow-y-auto mb-4 max-h-[80vh]">
          <ul>
            {
              result.map((item, index) =>
                item.type === 'q' ? (
                  <li key={index + Math.random()} className="p-1 rounded-lg shadow">
                    <Answers ans={item.text} index={index} totalResult={1} type="q" />
                  </li>
                ) : (
                  item.text.map((ansItem, ansIndex) => (
                    <li key={ansIndex + Math.random()} className="p-1 rounded-lg shadow">
                      <Answers ans={ansItem} index={ansIndex} totalResult={result.length} type="a" />
                    </li>
                  ))
                )
              )
            }
            {loading && (
              <li className="p-1 text-gray-400 animate-pulse">Thinking...</li>
            )}
          </ul>
        </div>

        {/* Input Section */}
        <div className="bg-zinc-800 w-full rounded-[10px] border border-zinc-600 flex items-center gap-2 p-3">
          <input
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            className="flex-1 p-3 rounded-lg bg-zinc-900 text-white outline-none"
            type="text"
            required
            placeholder="Ask me anything..."
          />
          <button
            onClick={askQuestion}
            className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full"
          >
            <AiOutlineSend className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
