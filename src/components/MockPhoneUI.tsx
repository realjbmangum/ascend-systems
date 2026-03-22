const messages = [
  { from: 'ai', text: 'Hi! Thanks for calling. How can I help you today?' },
  { from: 'user', text: 'I need to schedule an appointment for Thursday.' },
  { from: 'ai', text: 'I have 10am and 2pm available. Which works better?' },
  { from: 'user', text: '2pm works great.' },
];

export default function MockPhoneUI() {
  return (
    <div className="w-52 mx-auto">
      {/* Phone frame */}
      <div className="rounded-3xl border-4 border-charcoal bg-charcoal p-1 shadow-lg">
        {/* Notch */}
        <div className="flex justify-center mb-1">
          <div className="w-16 h-1.5 bg-charcoal-light rounded-full" />
        </div>

        {/* Screen */}
        <div className="bg-white rounded-2xl p-3 space-y-2 min-h-[240px]">
          {/* Header */}
          <div className="text-center pb-1.5 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-charcoal">AI Assistant</p>
            <p className="text-[8px] text-green-500 font-medium">Online</p>
          </div>

          {/* Messages */}
          <div className="space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[9px] leading-tight ${
                    msg.from === 'user'
                      ? 'bg-orange text-white rounded-br-sm'
                      : 'bg-gray-100 text-charcoal rounded-bl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home indicator */}
        <div className="flex justify-center mt-1">
          <div className="w-10 h-1 bg-charcoal-light rounded-full" />
        </div>
      </div>
    </div>
  );
}
