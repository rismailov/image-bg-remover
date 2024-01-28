import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from rembg import remove

app = FastAPI()

# load .env
load_dotenv()

# handle CORS
# https://fastapi.tiangolo.com/tutorial/cors/?h=cors
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL") or "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# serve static files
# https://fastapi.tiangolo.com/tutorial/static-files/
app.mount("/static", StaticFiles(directory="static"), name="static")


PATH_TO_IMAGES = "./static/images/"
PATH_AFFIX = "_bg_removed"


async def validate_file(file: UploadFile):
    """
    Validate a file by checking the size and mime types a.k.a file types
    """
    MIME_TYPES = ["image/png", "image/webp", "image/jpeg"]

    if file.content_type not in MIME_TYPES:
        print("MIME: ", file.content_type)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must an image with following format: JPEG, JPG, PNG, WEBP.",
        )

    """
    Validate file size
    """
    MAX_SIZE = 5_000_000

    size = await file.read()

    if len(size) > MAX_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size is too big. Limit is 5 MB.",
        )

    await file.seek(0)

    return file


@app.post("/images")
async def upload_file(file: UploadFile):
    await validate_file(file)

    # add affix to output file path
    # NOTE: wrapping into str() because fsr filename is of type str | None
    [filename, ext] = str(file.filename).split(".")
    out_path = f"{PATH_TO_IMAGES + filename + PATH_AFFIX}.{ext}"

    try:
        contents = file.file.read()

        # remove background and save the file
        with open(out_path, "wb") as o:
            result = remove(contents)
            o.write(result)  # type: ignore

        return {"path": out_path}
    except Exception:
        raise HTTPException(500, detail="There was an error uploading the image.")
    finally:
        file.file.close()
