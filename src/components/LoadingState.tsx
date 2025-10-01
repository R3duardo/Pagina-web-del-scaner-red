export default function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center py-40">
      <div className="relative mb-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-t-4 border-red-500 shadow-lg shadow-red-500/30"></div>
        <div
          className="animate-spin rounded-full h-32 w-32 border-b-4 border-t-4 border-pink-500 absolute top-0 left-0 shadow-lg shadow-pink-500/30"
          style={{ animationDirection: "reverse" }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          Cargando dispositivos...
        </h3>
        <p className="text-neutral-400">
          Analizando la red en busca de hosts
        </p>
      </div>
    </div>
  );
}