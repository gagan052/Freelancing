from setuptools import setup, find_packages

setup(
    name="enablefreelance-backend",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        "fastapi==0.68.1",
        "uvicorn==0.15.0",
        "python-multipart==0.0.5",
        "opencv-python==4.5.3.56",
        "numpy==1.21.2",
        "tensorflow==2.10.0",
        "mediapipe==0.8.7.3",
        "python-jose==3.3.0",
        "websockets==10.0",
    ],
) 