import React, { useState } from 'react'
import { AiOutlineSend } from "react-icons/ai"
import { RiMenuSearchLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GoSidebarCollapse } from "react-icons/go";
import { URL } from './contants'
import Answers from './components/Answers'
import { useDispatch, useSelector } from 'react-redux';
import { addToHistory, clearHistory, deleteHistoryItem } from './components/redux/slice/search-slice';

const App = () => {
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [sideBar, setSideBar] = useState(false)

  const dispatch = useDispatch()
  const search = useSelector(state => state.search.history)

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

      dispatch(addToHistory({
        question,
        ans: responseText
      }))

      setQuestion('');
    } catch (err) {
      console.error("API Error:", err);
      setResult(prev => [...prev, { type: 'a', text: ["Error: Could not fetch response."] }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col md:grid md:grid-cols-5 bg-zinc-900 text-zinc-300 relative">

      {/* Toggle Button Mobile */}
      <button
        onClick={() => setSideBar(!sideBar)}
        className="  absolute top-4 left-4 z-50 bg-zinc-800 text-white p-2 rounded-lg"
      >
        <GoSidebarCollapse size={24} />
      </button>

      {/* Sidebar */}
      <div className={`${sideBar ? 'block md:block' : 'hidden md:hidden'} 
      md:block md:col-span-1 bg-zinc-800 p-4 flex flex-col 
      md:sticky md:top-0 h-full animate__animated animate__fadeIn`}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <img src="https://stackviv.ai/wp-content/uploads/2024/03/YourGPT.png.webp"
            alt="GPT-logo"
            className="rounded-full w-[40px]" />
          <h2 className="text-lg font-semibold">yourGPT</h2>
        </div>

        {/* New Chat*/}
        <button onClick={() => {
          setResult([])
          setQuestion('')
        }}>
          <h3 className='flex text-center text-lg mt-5 mb-2 ml-1 text-white font-semibold items-center gap-2'>
            <FaEdit />
            New Chat
          </h3>
        </button>

        <h3 className="text-white font-semibold mb-2 text-center flex gap-2">
          <RiMenuSearchLine className='text-2xl' />
          Your History
        </h3>

        <ul className="text-sm space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 pr-1 max-h-[40vh] md:max-h-full">
          {search.length === 0 && <li className="text-zinc-400 italic">No history yet.</li>}
          {search.map((q, i) => (
            <li
              key={i}
              className="bg-white relative text-black font-bold mt-3 p-2 rounded-lg hover:bg-zinc-600 hover:text-white transition-all duration-200 flex justify-between items-center"
            >
              <span
                onClick={() => {
                  setQuestion(q.question);
                  setResult([
                    { type: 'q', text: q.question },
                    { type: 'a', text: q.ans }
                  ])
                }}
                className="flex-1 cursor-pointer"
              >
                {q.question}
              </span>
              <button
                onClick={() => dispatch(deleteHistoryItem(i))}
                className="ml-2 cursor-pointer text-xl rounded-full bg-red-400 text-white p-1"
              >
                <MdDelete />
              </button>
            </li>
          ))}
        </ul>

        {
          search.length > 0 &&
          <button
            onClick={() => dispatch(clearHistory())}
            className="text-sm text-center cursor-pointer mt-4 bg-rose-500 px-3 py-2 hover:bg-rose-700 transition-all duration-300 rounded-md text-white"
          >
            Clear All History
          </button>
        }
      </div>

      {/* Main Content */}
      <div className={`${sideBar ? 'md:col-span-4' : 'md:col-span-5'}
       transition-all duration-300 ease-in-out 
      flex flex-col justify-between h-full p-4 md:p-6`}>
        {
          result.length === 0 && !loading && (
            <h1
              className='text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 via-pink-400 to-rose-500 bg-clip-text text-transparent text-center'
            >
              What Can I Help With?
            </h1>
          )
        }

        {/* Output Section */}
        <div className="overflow-y-auto max-h-[50vh] md:max-h-[80vh] pr-2 mb-4">
          <ul>
            {
              result.map((item, index) =>
                <div key={index + Math.random()} className={item.type === 'q' ? 'flex justify-end' : ''}>
                  {
                    item.type === 'q' ? (
                      <li key={index + Math.random()} className="px-3 py-2 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl text-right bg-zinc-500 shadow">
                        <Answers ans={item.text} index={index} totalResult={1} type="q" />
                      </li>
                    ) : (
                      item.text.map((ansItem, ansIndex) => (
                        <li key={ansIndex + Math.random()} className="p-1 text-left rounded-lg shadow">
                          <Answers ans={ansItem} index={ansIndex} totalResult={result.length} type="a" />
                        </li>
                      ))
                    )
                  }
                </div>
              )
            }
            {loading && (
              <li className="p-1 text-gray-400 animate-pulse">Thinking...</li>
            )}
          </ul>
        </div>

        {/* Input Section */}
        <div className="bg-zinc-800 w-full rounded-[10px] border border-zinc-600 flex flex-row items-center gap-2 p-3">
          <input
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                askQuestion()
              }
            }}
            value={question}
            className="w-full sm:flex-1 p-3 rounded-lg bg-zinc-900 text-white outline-none"
            type="text"
            placeholder="Ask me anything..."
          />
          <button
            onClick={askQuestion}
            className="bg-blue-600 flex items-center justify-center hover:bg-blue-700 p-3 rounded-full"
          >
            <AiOutlineSend className="text-2xl" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
