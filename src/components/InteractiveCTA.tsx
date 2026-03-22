import { Link } from 'react-router-dom';

export default function InteractiveCTA() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 sm:py-28">
      {/* Animated gradient bg */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'linear-gradient(135deg, #1E2A32 0%, #D4632C 50%, #1E2A32 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease-in-out infinite',
        }}
      />

      {/* Dot particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-orange/20"
            style={{
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 100}%`,
              animation: `floatDot ${3 + (i % 4)}s ease-in-out ${(i % 5) * 0.5}s infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to talk about your project?
        </h2>
        <p className="text-gray-400 text-lg max-w-lg mx-auto mb-10">
          Tell us what challenge you are facing. We will give you an honest assessment of timeline, cost, and approach — no strings attached.
        </p>
        <Link
          to="/contact"
          className="group relative inline-block bg-orange hover:bg-orange-dark text-white text-lg font-semibold px-8 py-4 rounded-lg transition-all shadow-orange-glow hover:shadow-orange-glow-lg"
        >
          <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ boxShadow: '0 0 30px rgba(212, 99, 44, 0.5)' }} />
          <span className="relative">Book a Free Discovery Call</span>
        </Link>
      </div>

      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatDot {
          0% { transform: translateY(0); }
          100% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  );
}
