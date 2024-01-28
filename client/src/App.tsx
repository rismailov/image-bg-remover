import { Dropzone } from './components/Dropzone'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from './components/ui/card'
import { Toaster } from './components/ui/sonner'

function App() {
    return (
        <>
            <Toaster />

            <div className="min-h-screen flex">
                <div className="container">
                    <div className="h-full flex items-center justify-center">
                        <Card className="w-full max-w-[450px] rounded-xl">
                            <CardHeader>
                                <CardTitle>Background Remover</CardTitle>

                                <CardDescription className="text-base">
                                    Upload an image to remove its background.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <Dropzone />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
