import axios from '@/lib/axios'
import { cn } from '@/lib/utils'
import { isAxiosError } from 'axios'
import {
    DownloadIcon,
    Loader2,
    TrashIcon,
    UploadCloudIcon,
    UploadIcon,
} from 'lucide-react'
import { useReducer, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from './ui/button'

type TState = {
    // file Blob that will be sent to the backend
    image: File | undefined
    // file input image preview
    preview: string | null
    // path of the (result) image with background removed, that comes from backend
    resultPath: string | null
    // if form is submitting (uploading or downloading an image)
    isSubmitting: boolean
}

export const Dropzone = () => {
    const [{ image, preview, resultPath, isSubmitting }, updateState] =
        useReducer(
            (prev: TState, next: Partial<TState>) => ({ ...prev, ...next }),
            {
                image: undefined,
                preview: null,
                resultPath: null,
                isSubmitting: false,
            },
        )

    // this ref is needed purely for (completely) resetting the input
    const inputRef = useRef<HTMLInputElement>(null)

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = (event.target.files as FileList)?.[0]

        updateState({
            image: file,
            preview: URL.createObjectURL(file),
        })
    }

    const onReset = () => {
        if (inputRef.current) {
            inputRef.current.value = ''
        }

        updateState({
            image: undefined,
            preview: null,
            resultPath: null,
        })
    }

    const uploadFile = () => {
        updateState({ isSubmitting: true })

        const formData = new FormData()
        formData.append('file', image as Blob)

        axios
            .post<{ path: string }>('/images', formData)
            .then(({ data }) =>
                updateState({
                    resultPath: data.path,
                }),
            )
            .catch((e) => {
                if (isAxiosError<{ message: string }>(e)) {
                    toast(e.response?.data.message)
                }
            })
            .finally(() => {
                updateState({ isSubmitting: false })
            })
    }

    const downloadFile = () => {
        alert('Download file')
    }

    return (
        <div className="relative flex flex-col w-full">
            {(image || resultPath) && (
                <Button
                    onClick={onReset}
                    size="icon"
                    variant="secondary"
                    className="absolute right-3 top-3 bg-red-600/10 hover:bg-red-600/15 text-red-600 w-8 h-8"
                >
                    <TrashIcon className="w-4 h-4" />
                </Button>
            )}

            {!preview && !resultPath && (
                <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-72 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/40"
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 overflow-hidden">
                        <UploadCloudIcon
                            className="w-9 h-9 mb-2 text-muted-foreground"
                            strokeWidth={1.5}
                        />

                        <p className="mb-2 font-semibold text-gray-500 dark:text-gray-400">
                            Click to upload image
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            SVG, PNG, JPG or WEBP (Max: 800x400px)
                        </p>
                    </div>
                </label>
            )}

            {(preview || resultPath) && (
                <div
                    className={cn(
                        'w-full h-72 flex justify-center rounded-lg border overflow-hidden',
                    )}
                >
                    <img
                        src={
                            (resultPath as string)
                                ? `${import.meta.env.VITE_BACKEND_URL}/${resultPath}`
                                : (preview as string)
                        }
                        alt={resultPath ? 'Result' : 'Preview'}
                        className={cn(
                            'object-center object-fit h-full',
                            resultPath && 'transparent',
                        )}
                    />
                </div>
            )}

            <input
                ref={inputRef}
                id="dropzone-file"
                onChange={onChange}
                type="file"
                className="hidden"
            />

            <Button
                onClick={resultPath ? downloadFile : uploadFile}
                disabled={!image || isSubmitting}
                className="mt-5 h-11 [&>svg]:w-5 [&>svg]:h-5 [&>svg]:ml-3 rounded-full"
            >
                {isSubmitting ? (
                    <Loader2 className="ml-0 animate-spin" />
                ) : (
                    <>
                        <span>{resultPath ? 'Download' : 'Upload'}</span>

                        {resultPath ? <DownloadIcon /> : <UploadIcon />}
                    </>
                )}
            </Button>
        </div>
    )
}
