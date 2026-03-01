import ChatPanel from '../components/ChatPanel'

export default function Chat() {
  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-72px)] -mx-5 -mt-6">
      <div className="h-full max-w-3xl mx-auto border-x border-gray-200 bg-white">
        <ChatPanel />
      </div>
    </div>
  )
}
