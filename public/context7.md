# Default Uploader

> API service for uploading, storing, transforming, optimizing, and delivering images, videos, and documents. No vendor lock-in — use any S3-compatible storage.

- Website: https://docs.defaultuploader.com
- Admin Panel: https://admin.defaultuploader.com
- API Base URL: https://api.defaultuploader.com

## Overview

Default Uploader is an API service that handles file upload, on-the-fly transformation, and delivery of images, videos, and documents. It works with any S3-compatible storage and CDN, eliminating vendor lock-in. The service uses a pay-as-you-go model.

### Architecture

1. **Load Balancer** — distributes incoming requests among application instances.
2. **Applications** — handle user requests, check if a transformed file already exists, and create transformation jobs if needed.
3. **Workers** — perform actual file transformations, save results to storage.
4. **Storage** — any S3-compatible storage for original and transformed files.
5. **Distributed Cache** — stores encrypted secret keys and critical data for fast access.

### Pricing

- **Traffic:** $0.01 per GB (upload/download from storage).
- **CPU time:** $0.0001 per second of file processing.
- **Sign-up bonus:** 100 GB of traffic and 1 hour of processing free.
- **Payment threshold:** $20 (enough for 2 TB of traffic or 55 hours of CPU time).

### Quotas

- Max image size for transformation: **40 MB**.
- Max video size for transformation: **4 GB**.
- Files of any size (up to 5 TB) can be uploaded and downloaded; quotas apply only to transformations.

---

## Getting Started

### Prerequisites

1. Create an account at [admin.defaultuploader.com](https://admin.defaultuploader.com).
2. Connect an S3 storage (fill in the S3 and CDN connection settings in the dashboard).

### Supported S3 Providers

Any S3-compatible storage works. Documented guides exist for:
- MinIO (local testing)
- VK Cloud
- Backblaze
- Selectel
- cloud.ru

### Connecting S3

Create a service account with your S3 provider, obtain the secret and access keys, and create a bucket. Enter the Endpoint URL and region in the Default Uploader dashboard.

### Upload Your First File

```bash
curl --location 'https://api.defaultuploader.com/v1/upload' \
--header 'Authorization: YOUR_SECRET_CLIENT_TOKEN' \
--form 'file=@"/path/to/file.jpg"'
```

Response:

```json
[
  {
    "sourceName": "7uLbiXh7867H7dEPpsubV9.png",
    "src": "https://api.defaultuploader.com/v1/image/upload/CLIENT_TOKEN/7uLbiXh7867H7dEPpsubV9.png",
    "originalSrc": "https://your-s3.storage.com/bucket/image/png/7uLbiXh7867H7dEPpsubV9.png",
    "originalName": "original_filename.png",
    "s3PathOriginal": "image/png/7uLbiXh7867H7dEPpsubV9.png",
    "s3Path": "image/png/7uLbiXh7867H7dEPpsubV9.png",
    "options": {},
    "size": 1400308,
    "mimeType": "image",
    "format": "png"
  }
]
```

Transform the file by adding query parameters to the `src` URL:

```
https://api.defaultuploader.com/v1/image/upload/CLIENT_TOKEN/sample.jpg?w=100
```

---

## REST API

Base URL: `https://api.defaultuploader.com`

### POST /v1/upload

Upload files via `multipart/form-data`.

**Headers:**
| Header        | Value                    |
|---------------|--------------------------|
| Authorization | YOUR_SECRET_CLIENT_TOKEN |

**Request:**
```bash
curl --location 'https://api.defaultuploader.com/v1/upload' \
--header 'Authorization: YOUR_SECRET_CLIENT_TOKEN' \
--form 'file=@"/path/to/file.jpg"'
```

**Response:** Always returns a JSON array of uploaded file objects.

### GET /v1/{MIME_TYPE}/upload/{CLIENT_TOKEN}/{S3_PATH}

Retrieve a file. Apply transformations via query parameters.

```
v1 — API version
MIME_TYPE — media type (image, video, audio)
CLIENT_TOKEN — token from the dashboard
S3_PATH — file path in your S3 storage
```

**Response Headers:**
| Key            | Value                    |
|----------------|--------------------------|
| cache-control  | public, max-age=604800   |
| etag           | file path                |
| accept-ranges  | bytes                    |
| content-length | file size in bytes       |
| content-type   | MIME type                |

### PUT (Presigned URL Upload)

Upload files using a presigned URL without authentication. See Presigned URL section.

### DELETE /v1/upload/{S3_PATH_ORIGINAL}

Deletes the original file and all derivative (transformed) files.

**Headers:**
| Header        | Value                    |
|---------------|--------------------------|
| Authorization | YOUR_SECRET_CLIENT_TOKEN |

---

## Upload with Custom Path

Add `?path=PATH` query parameter to organize files into custom folders.

```bash
curl --location 'https://api.defaultuploader.com/v1/upload?path=mysite.com/cats' \
--header 'Authorization: YOUR_SECRET_CLIENT_TOKEN' \
--form 'file=@"/path/to/cat.jpg"'
```

Resulting bucket structure:
```
bucket/
  mysite.com/
    cats/
      image/
        jpg/
          file.jpg
```

You can organize files by user identifiers (e.g., `?path=user@email.com`) to track resource usage per user.

---

## Asynchronous Transformations

Upload a file and trigger transformations immediately by passing `transforms` in the form data.

```bash
curl --location 'https://api.defaultuploader.com/v1/upload' \
--header 'Authorization: YOUR_SECRET_CLIENT_TOKEN' \
--form 'file=@"/path/to/cat.jpg"' \
--form 'transforms="[\"w=100&h=100\",\"w=200&h=200\"]"'
```

This creates 3 files in the bucket: the original + one file per transformation set. Transformed files are available immediately on subsequent requests without waiting for on-the-fly processing.

---

## Presigned URL

Generate a temporary upload URL that allows file upload without authentication.

### Generate Presigned URL

```
GET /v1/sign/{SECRET_CLIENT_TOKEN}/{CUSTOM_PATH}?expirationIn=3600
```

- `expirationIn` — expiration time in seconds.

### Upload with Presigned URL

Use the `PUT` method to send a file to the presigned URL.

### Limitations

- Maximum duration: 604800 seconds (1 week).
- Rate limit: 1000 links per hour (can be increased upon request).
- Maximum URL length: 300 characters.

### Integration Flow

1. Client requests an upload link from your backend.
2. Your backend requests a presigned URL from Default Uploader with a timeout and custom path.
3. Your backend returns the presigned URL to the client.
4. Client uploads the file directly using the presigned URL.

---

## Soft Migration

Enable in the dashboard to process files uploaded by another system. Useful when integrating Default Uploader into an existing application with pre-existing files.

To retrieve a file, construct a GET request with the full path from your bucket root:

```
GET https://api.defaultuploader.com/v1/{MIME_TYPE}/upload/{CLIENT_TOKEN}/mysite.com/cats/image/file.jpg
```

`MIME_TYPE` can be any of: `image`, `video`, `audio`. Transformations work regardless of the specified value.

Supports migration from Cloudinary, Uploadcare, and other services that offer S3 backup on paid plans.

---

## Fetch (Download by URL)

Download an image from a remote URL and apply transformations.

```
GET /v1/image/fetch/{CLIENT_TOKEN}/{REMOTE_URL}?{PARAMS}
```

### Example

```
https://api.defaultuploader.com/v1/image/fetch/CLIENT_TOKEN/https://example.com/image.jpg?w=100
```

### Limitations

- Rate limit: 50 requests per 5 seconds (can be increased upon request).

### Save to S3 (Coming soon)

- Enable auto-save in account settings, or
- Use `/v1/image/fetch/keep/{CLIENT_TOKEN}/{REMOTE_URL}` to explicitly save.

---

## Transformation Limits

Set a maximum number of transformations per file type (image, video) in the dashboard. When the limit is reached, the original file is returned instead of creating new transformations.

This protects against API abuse (e.g., attackers spamming `?w=100`, `?w=101`, etc.).

---

## Image Transformations

Apply transformations via query parameters on GET requests.

```
https://api.defaultuploader.com/v1/image/upload/{CLIENT_TOKEN}/sample.jpg?w=100&q=75
```

Transformed files are created on first request and cached for subsequent requests.

### Parameters

#### width (alias: w)
Resize width while maintaining aspect ratio.
- Range: 0–5000

```
?w=100
?w=200
?w=300
```

#### height (alias: h)
Resize height while maintaining aspect ratio.
- Range: 0–5000

```
?h=100
?h=200
```

#### format (alias: f)
Convert to another image format.
- Supported: JPEG, PNG, WebP, AVIF, TIFF, GIF, SVG, HEIC
- `auto` — automatic browser format detection (coming soon)

```
?f=webp
?f=avif
```

#### quality (alias: q)
Adjust image quality.
- Range: 0–100, default: 75

```
?q=100
?q=50
```

#### dpr
Device pixel ratio for high-resolution screens.
- Values: 1, 2 (default: 1)
- Doubles the image dimensions when set to 2.

```
?w=100&dpr=2
```

#### animated (alias: a)
Disable animation for GIF or WebP.

```
?animated=0
```

#### fit
How the image is resized/cropped to fit target dimensions.
- Values: `cover`, `contain`, `fill`, `inside`, `outside`

```
?h=200&w=500&fit=cover
?h=200&w=500&fit=contain
```

#### func
Smart crop using AI.
- Values: `face`, `auto`
- `face` — finds and centers on a face in the image.
- `auto` — finds the "interesting" part of the image.

```
?h=500&w=500&func=face
```

#### zoom (alias: z)
Margin adjustment for smart cropping.
- Range: 1–10, step: 0.1

```
?h=600&w=600&func=face&zoom=2
```

#### blur
Apply gaussian blur.
- Range: 0.3–1000

```
?blur=10
```

#### negate
Create a negative of the image.

```
?negate
```

#### normalize_lower
Enhance contrast by stretching brightness (lower bound).
- Range: 1–99

```
?normalize_lower=65
```

#### normalize_upper
Enhance contrast by stretching brightness (upper bound).
- Range: 1–99

```
?normalize_upper=95
```

#### saturation
Adjust image saturation.
- Min: 0.1

```
?saturation=0.1
?saturation=1.5
```

#### brightness
Adjust image brightness.
- Min: 0.1

```
?brightness=0.1
?brightness=1.5
```

#### hue
Adjust image hue.
- Min: 1

```
?hue=25
```

#### lightness
Adjust image lightness.
- Min: 0.1

```
?lightness=30
```

#### greyscale
Convert to black and white.

```
?greyscale
```

#### radius (alias: rs)
Round image corners.
- Range: 0–100
- Use `rs=50` with equal width/height for a circle.

```
?rs=5
?rs=50&w=400&h=400
```

#### remove_background (alias: rm_bg)
AI-powered background removal.

```
?rm_bg
```

**Avatar creation tip:** Combine `rm_bg`, `func=face`, `z=2`, and `rs=50` for automatic avatar generation.

#### super_resolution (Coming soon)
AI-powered image upscaling.

---

## Video Transformations

Video transformation is resource-intensive. Use asynchronous transformations for video processing when possible.

If a video has not yet been transformed, the API returns HTTP status `423` (file not ready).

```
https://api.defaultuploader.com/v1/video/upload/{CLIENT_TOKEN}/sample.mp4?q_a
```

### Parameters

#### q_auto (alias: q_a)
Automatic quality optimization — preserves visual quality while significantly reducing file size.

```
?q_a
```

Typical result: 50 MB original → 7 MB optimized.

#### width (alias: w)
Resize width while maintaining aspect ratio.
- Range: 0–5000

```
?w=300
```

#### height (alias: h)
Resize height while maintaining aspect ratio.
- Range: 0–5000

```
?h=300
```

#### format (alias: f)
Convert video format.
- Supported: MP4, MOV, WEBM, AVI
- Default: MP4

```
?f=webm
```

#### vertical (alias: vt)
Create a 9:16 vertical video by cropping the center. Ideal for social media.

```
?vt
```

Typical result with `q_a`: 50 MB original → 2.94 MB optimized vertical video.

#### thumbnail
Extract a thumbnail image from the video.

```
?thumbnail
```

By default, uses a frame from the first 100ms.

#### duration
Specify the moment for thumbnail extraction (works only with `thumbnail`).
- 1 = 100ms

```
?thumbnail&duration=311
```

#### keyframe (alias: kf)
Set the keyframe interval (GOP size). Lower values improve seek accuracy but increase file size.
- Range: 1–120

```
?keyframe=30
```

#### kf_boost
Enable adaptive keyframe placement: more frequent keyframes at the start (every 0.5s during first 5s), less frequent afterward (every 2s). Improves initial playback and seek performance.

```
?kf_boost
```

> Note: `kf_boost` takes priority over `keyframe`. If both are specified, only `kf_boost` is applied.

---

## Image Scanning (NSFW Detection)

### Bucket Scan
Click the "Scan" button in the dashboard. A text file with addresses of detected NSFW content is generated. Enter a prefix to scan only a specific folder.

```
/mysite.com/dogs
```

### Upload Webhook
Every uploaded file is scanned for NSFW content. Configure a webhook URL in the dashboard to receive POST notifications with details about detected content.

---

## Predefined Transformations (Coming soon)

Define transformation rules for file uploads and default transformations for all files.

### Predefined File Set
Create a set of images for different screen sizes and formats:
```
['w=360', 'w=768', 'w=1024']
['w=360&f=avif', 'w=768&f=avif', 'w=1024&f=avif']
```

### Default File Transformation
Enable default transformation settings without parameters:
```
['f=auto&q=75&w=768']
```

---

## CDN Integration

Default Uploader does not have its own CDN. For production, route traffic through a CDN.

### CDN Configuration Notes
- Ensure query parameters are NOT ignored in CDN settings.
- The service returns `cache-control: public, max-age=2592000` (30 days) for successful responses.

### Option 1: CDN → Default Uploader API (Recommended)
Point your CDN origin to `https://api.defaultuploader.com`. This enables full dynamic transformation and optimization.

```
CDN origin: api.defaultuploader.com
User → CDN → Default Uploader → S3
```

### Option 2: CDN → S3 (Maximum Efficiency)
Point your CDN to S3 and use asynchronous transformations on upload. All subsequent requests are served by CDN without using Default Uploader resources.

> Note: On-the-fly optimization does not work in this scenario.

```
User → CDN → S3 (pre-transformed files)
```

---

## CDN Middleware (Coming soon)

Default Uploader acts as middleware between CDN and your application.

### Setup
1. Create a subdomain for media files with your CDN, set origin to `api.defaultuploader.com`.
2. In your application, use the CDN subdomain for file URLs.
3. Configure default optimization settings in the dashboard.

### Example
```html
<!-- before -->
<img src="https://site.com/image.jpg" />

<!-- after -->
<img src="https://cdn.site.com/image.jpg" />

<!-- Automatically optimized with default settings (e.g., quality=75, format=auto) -->
```

---

## Node.js Example

A complete Express.js server for file uploads:

```javascript
const axios = require('axios');
const express = require('express');
const multer = require('multer');
const FormData = require('form-data');

const app = express();
const port = 3000;

const url = 'https://api.defaultuploader.com/v1/upload';
const token = 'YOUR_SECRET_CLIENT_TOKEN';

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.any('file'), async (req, res) => {
  try {
    const form = new FormData();
    for (const file of req.files) {
      form.append('file', file.buffer, {
        filename: file.originalname,
      });
    }

    const response = await axios.post(url, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `${token}`,
      },
    });

    console.log('File uploaded successfully!');
    res.status(200).json({ data: response.data });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ error: 'File upload failed' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
```

### Setup
```bash
mkdir myuploaderserver && cd myuploaderserver && npm init -y
npm i axios express multer form-data
node index.js
```

### Test
```bash
curl --location 'http://localhost:3000/upload' \
--header 'Content-Type: image/svg+xml' \
--header 'Authorization: SECRET_CLIENT_TOKEN' \
--form 'image=@"/path/to/image.jpg"'
```
