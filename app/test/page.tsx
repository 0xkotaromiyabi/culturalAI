export default function TestPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">🔧 API Test Page</h1>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                    <h2 className="text-xl font-semibold mb-4">Test Gemini API Key</h2>
                    <p className="mb-4 text-gray-600">
                        Click the button below to test if your Google Gemini API key works:
                    </p>
                    <a
                        href="/api/test-gemini"
                        target="_blank"
                        className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                        🧪 Test API Key
                    </a>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Troubleshooting</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-yellow-700">
                        <li>If you see <code className="bg-yellow-100 px-1">"success": true</code> - API key works!</li>
                        <li>If you see error 400/401 - API key is invalid or expired</li>
                        <li>If you see error 403 - Gemini API not enabled in your Google Cloud project</li>
                    </ul>

                    <div className="mt-4 pt-4 border-t border-yellow-200">
                        <p className="font-semibold text-yellow-800 mb-2">🔑 Get a new API key:</p>
                        <a
                            href="https://aistudio.google.com/app/apikey"
                            target="_blank"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            https://aistudio.google.com/app/apikey
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
