from setuptools import setup, find_packages

setup(
    name="sign_language_ide",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "opencv-python",
        "tensorflow",
        "numpy",
        "python-multipart",
        "python-dotenv",
        "websockets",
        "mediapipe",
        "transformers",
        "torch",
    ],
    extras_require={
        "dev": [
            "pytest",
            "black",
            "flake8",
            "mypy",
        ]
    },
) 