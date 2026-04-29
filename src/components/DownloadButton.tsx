'use client';

interface DownloadButtonProps {
  text: string;
  filename?: string;
  label?: string;
}

export default function DownloadButton({ text, filename = 'download.txt', label = 'Download .txt' }: DownloadButtonProps) {
  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white text-sm font-medium rounded-lg transition-all"
    >
      {label}
    </button>
  );
}
