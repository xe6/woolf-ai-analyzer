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
2. Copy env template (`.env.example`) file and rename it to `.env` for specifying environment variables, or use this shell command if on UNIX-like shell:
```sh
cp .env.example .env
```
3. Fill .env file with your vertex endpoint and auth token.
4. The application requires underlying system dependencies (`graphicsmagick` and `ghostscript`), hence recommended approach is to run this application in docker, where these dependencies are automatically installed for you:
```sh
# Assuming you are in the project root directory and have docker installed
docker build -t woolf-ai-analyzer .
docker run -d -p 3030:3030 --name woolf-ai-analyzer-container woolf-ai-analyzer
```
5. The API will run on `3030` port in your local machine

#### Alternative option: run locally, without docker
If you still want to run the API locally without docker, you can install system dependencies on your machine using [this documentation](https://github.com/yakovmeister/pdf2image/blob/HEAD/docs/gm-installation.md).

After `graphicsmagick` and `ghostscript` are installed on your system:

0. Install `pnpm` (if not installed):
https://pnpm.io/installation

1. Install packages:
```sh
pnpm install
```

2. Start the service
```sh
pnpm start
```


---
## Usage
Once the API service is running, you can submit a POST request to the endpoint at:

http://localhost:3030/pdf-analyzer/cv-job-match

This request should include two PDF files submitted via multipart/form-data:

- One PDF file should be the Job Description.
- The other PDF file should be the Candidate’s CV.

> There is no need to specify the order of the files, as the AI will automatically determine which file is the job description and which one is the candidate’s CV.


#### cUrl request
```sh
curl -X POST http://localhost:3030/pdf-analyzer/cv-job-match \
  -F "files=@/path/to/your/cv.pdf" \
  -F "files=@/path/to/your/job-description.pdf"
```

#### Swagger OpenAPI UI
You can also use Swagger UI to upload the files and execute the request.

1.	Navigate to Swagger UI at http://localhost:3030/api
2.	Click on the Add string item button (note: this is a default UI label in Swagger, it's not actually a string item, it's a file item).
3.	Select your PDF files using the Browse… button.
4.	Click Execute to run the request.

![alt text](<docs/images/swagger-ui.png>)

> Note: Sometimes, the underlying VertexAI endpoint may decline the request, in which case you will receive 500 Internal Server Error with 'Failed to send request to Vertex AI. Please, try again later.' error message. In this case, you should wait a little bit and try again.

---
## Considerations for further improvement
Since this project serves as an MVP to demonstrate technical skills and the integration of the VertexAI API, several aspects such as validation, rate-limiting, and security measures were intentionally left out to maintain focus on the core functionality.

Below is a list of potential improvements that can be implemented in future iterations to enhance the robustness, scalability, and security of the application:

1. Input Validation:

- Ensure that uploaded files meet specific criteria, such as format (only PDF files allowed), file size, and content type.
- Implement schema validation (e.g., using Zod or Joi) for incoming data to prevent malformed requests.

2. Rate-Limiting:

- Implement rate-limiting to prevent abuse of the API by limiting the number of requests from a single IP or user within a given time frame (e.g., using @nestjs/throttler).
  
3. Authentication:

- Introduce user authentication (e.g., JWT, OAuth) to secure endpoints and limit access to authorized users.

4.	Cloud File Storage instead of in-memory buffer store:

- When handling a lot of concurrent requests, Node.js server will likely run out of memory to process intermediate PDF files.
- Consider integrating cloud storage solutions (e.g., AWS S3, Google Cloud Storage) to handle file uploads and provide better scalability.
- Implement a file retention policy to manage file storage and clean up unused files after a certain period.

5.	Container optimization:

- Use more lightweight and secure base image to run the application

---
## Notes on technical implementation

- The hosted API endpoint does not support static links to PDF files, as it only accepts file URIs in the `gs://` schema (for Google Cloud Storage files within the context of a GCP project). To work around this limitation, I used `InlineDataPart`, which handles base64-encoded images only.

- File uploads are managed by converting PDF files into images (one image per PDF page) using the `pdf2pic` library. This library requires `GraphicsMagick` and `Ghostscript` as system dependencies. To simplify the developer experience (DX), I included a `Dockerfile` that handles these dependencies, allowing the API application to be built and run without requiring local installation of the underlying dependencies.

- I chose `pdf2pic` because it offers a simple and efficient way to convert PDF files directly into base64-encoded images, which suits the project requirements.

- Although `tRPC` recently introduced support for file uploads (starting from version `11.x`), I opted not to use it for this project. A REST API seemed more appropriate for handling file uploads, especially since we are not using a client application that would benefit from schema sharing — one of the key advantages of `tRPC`.