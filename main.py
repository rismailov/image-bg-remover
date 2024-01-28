import os

from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile
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


@app.post("/images")
def upload_file(file: UploadFile):
    # this is to supress linter warnings, cuz of filename type being str | None
    if not file.filename:
        return {"message": "Something went wrong"}

    try:
        # add affix to file path
        [filename, ext] = file.filename.split(".")
        out_path = f"{PATH_TO_IMAGES + filename + PATH_AFFIX}.{ext}"

        contents = file.file.read()

        # remove bg and save the file
        with open(out_path, "wb") as o:
            output = remove(contents)
            o.write(output)  # type:ignore

        return {"path": out_path}
    except Exception:
        return {"message": "There was an error uploading the file"}
    finally:
        file.file.close()
