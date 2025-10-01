import ErrorIcon from "@/components/icons/ErrorIcon";

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-5xl mx-auto bg-red-900/20 border-l-4 border-red-500 p-6 rounded-r-lg">
      <div className="flex items-center">
        <ErrorIcon className="w-6 h-6 text-red-500 mr-3" />
        <p className="text-red-400 text-lg">{message}</p>
      </div>
    </div>
  );
}