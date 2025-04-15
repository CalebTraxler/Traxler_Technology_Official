import WebcamCapture from '@/components/WebcamCapture';

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold mb-4">Real-time AI Vision Analysis</h1>
            <WebcamCapture />
        </main>
    );
}