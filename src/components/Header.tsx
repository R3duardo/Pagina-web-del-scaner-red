export default function Header() {
  return (
    <div className="text-center">
      <div className="relative">
        <h1 className="text-4xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl text-glow animate-gradientShift">
          Escaner de Red
        </h1>
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      </div>
    </div>
  );
}