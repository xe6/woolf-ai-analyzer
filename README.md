# Woolf AI Resume Analyzer

This simple service is a Node.js server with a single API endpoint that accepts two PDFs: a job description and a CV. The server uses AI to analyze both files, identifying the candidate's strengths and weaknesses, and evaluates how well they align with the job description.

Returns the response in this format:

```json
{
    "analysis": "AI breakdown",
    "percentMatch": 50
}

```

---
## Local Setup
1. Clone the repo.
2. Copy env template:
```sh
cp .env.example .env
```
3. Fill .env file with your vertex endpoint and auth token.
4. The application requires underlying system dependencies (`graphicsmagick` and `ghostscript`), hence recommended approach is to run this application in docker, where these dependencies are automatically installed for you:
```sh
# Assuming you are in the project root directory
docker build -t woolf-ai-analyzer .
docker run -d -p 3030:3030 --name woolf-ai-analyzer-container woolf-ai-analyzer
```
5. Once run, the API will run on 3030 port in your local machine

#### Alternative option: run locally, without docker
If you still want to run the API locally without docker, you can install system dependencies on your machine using this documentation: https://github.com/yakovmeister/pdf2image/blob/HEAD/docs/gm-installation.md

---
### Usage
Once the API service is running, you can use `POST` `http://localhost:3030/pdf-analyzer/cv-job-match` endpoint to execute your request, providing two PDF files using multipart-formdata.

One PDF file should be Job Description, the other one should be Candidate CV.

#### cUrl request
```sh
curl -X POST http://localhost:3030/pdf-analyzer/cv-job-match \
  -F "files=@/path/to/your/file1.pdf" \
  -F "files=@/path/to/your/file2.pdf"
```