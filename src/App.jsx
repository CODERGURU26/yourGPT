import React, { useState } from 'react'
import { AiOutlineSend } from "react-icons/ai"
import { RiMenuSearchLine } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { GoCopy } from "react-icons/go";
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
  const [copiedIndex , setCopiedIndex] = useState(null)

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
    <div className="h-screen w-full flex bg-zinc-900 text-zinc-300 overflow-hidden">

      {/* Mobile Overlay */}
      {sideBar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSideBar(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${sideBar ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 fixed md:relative z-50 md:z-auto
        w-80 h-full bg-zinc-800 border-r border-zinc-700
        transition-transform duration-300 ease-in-out
        flex flex-col`}>

        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <div className="flex items-center gap-3">
            <img
              src="https://stackviv.ai/wp-content/uploads/2024/03/YourGPT.png.webp"
              alt="GPT-logo"
              className="rounded-full w-8 h-8"
            />
    
          </div>
          <button
            onClick={() => setSideBar(false)}
            className="md:hidden text-zinc-400 hover:text-white p-1"
          >
            <GoSidebarCollapse size={20} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4 border-b border-zinc-700">
          <button
            onClick={() => {
              setResult([])
              setQuestion('')
              setSideBar(false)
            }}
            className="w-full flex items-center gap-3 p-3 bg-zinc-700 hover:bg-zinc-600 
              rounded-lg transition-all duration-200 text-white font-medium cursor-pointer"
          >
            <FaEdit size={16} />
            New Chat
          </button>
        </div>

        {/* History Section */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <RiMenuSearchLine className="text-xl text-zinc-400" />
            <h3 className="text-white font-semibold">Chat History</h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
            {search.length === 0 ? (
              <p className="text-zinc-400 text-sm italic text-center py-8">No conversations yet</p>
            ) : (
              search.map((q, i) => (
                <div
                  key={i}
                  className="group bg-zinc-700 hover:bg-zinc-600 p-3 rounded-lg 
                    transition-all duration-200 cursor-pointer border border-transparent 
                    hover:border-zinc-500"
                >
                  <div
                    onClick={() => {
                      setQuestion(q.question);
                      setResult([
                        { type: 'q', text: q.question },
                        { type: 'a', text: q.ans }
                      ])
                      setSideBar(false)
                    }}
                    className="flex items-center justify-between"
                  >
                    <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                      {q.question}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dispatch(deleteHistoryItem(i))
                      }}
                      className="opacity-0 group-hover:opacity-100
                       bg-red-500 text-white rounded-2xl text-xl
                       hover:text-red-300 transition-all duration-200 p-1"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

          {search.length > 0 && (
            <button
              onClick={() => dispatch(clearHistory())}
              className="mt-4 w-full p-2 cursor-pointer bg-red-600 hover:bg-red-700 
                text-white text-sm font-medium rounded-lg transition-all duration-200"
            >
              Clear All History
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0">

        {/* Top Navigation */}
        <nav className="bg-zinc-800 border-b border-zinc-700 px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSideBar(true)}
              className="md:hidden text-zinc-400 hover:text-white p-2 -ml-2"
            >
              <GoSidebarCollapse size={20} />
            </button>
            <img
              src="https://stackviv.ai/wp-content/uploads/2024/03/YourGPT.png.webp"
              alt="GPT-logo"
              className="w-8 h-8 rounded-full"
            />
            <h1 className="text-lg font-semibold text-white">yourGPT</h1>
          </div>
        </nav>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* Welcome Message */}
          {result.length === 0 && !loading && (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-2xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4
                  bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 
                  bg-clip-text text-transparent">
                  What Can I Help With?
                </h1>
                <p className="text-zinc-400 text-lg">
                  Ask me anything and I'll do my best to help you out.
                </p>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent">
            {result.map((item, index) => (
              <div key={index} className={`flex ${item.type === 'q' ? 'justify-end' : 'justify-start'}`}>
                {item.type === 'q' ? (
                  <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl">
                    <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-br-md">
                      <Answers ans={item.text} index={index} totalResult={1} type="q" />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-xs md:max-w-md lg:max-w-lg xl:max-w-2xl">
                    <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl rounded-bl-md">
                      {item.text.map((ansItem, ansIndex) => (
                        <div key={ansIndex} className="mb-2 gap-2 items-center group last:mb-0 flex ">
                          <Answers ans={ansItem} index={ansIndex} totalResult={result.length} type="a" />

                          <button onClick={()=>{
                            navigator.clipboard.writeText(ansItem)
                            setCopiedIndex(`${index}-${ansIndex}`)
                            setTimeout(()=> setCopiedIndex(null),1500)
                          }}
                          className=' text-xs text-white
                           bg-zinc-800 rounded-md duration-300 px-3 py-2
                            hover:bg-zinc-600 cursor-pointer flex items-center gap-1'
                          >
                            <GoCopy />Copy
                          </button>
                        {
                          copiedIndex === `${index}-${ansIndex}` &&
                          <span
                          className='text-xs text-green-400'
                          >Copied!!</span>
                        }
                          
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="p-4 border-t border-zinc-700 bg-zinc-900">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3 bg-zinc-800 border border-zinc-600 
                rounded-2xl p-3 focus-within:border-blue-500 transition-colors duration-200">
                <input
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      askQuestion()
                    }
                  }}
                  value={question}
                  className="flex-1 bg-transparent text-white placeholder-zinc-400 
                    outline-none resize-none min-h-[24px] max-h-32 py-2"
                  placeholder="Ask me anything..."
                  disabled={loading}
                />
                <button
                  onClick={askQuestion}
                  disabled={loading || !question.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-600 
                    disabled:cursor-not-allowed p-2 rounded-xl transition-all duration-200 
                    flex items-center justify-center min-w-[40px] h-10"
                >
                  <AiOutlineSend className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App