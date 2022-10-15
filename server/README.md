# API Documentation

This is exactly what you think it is.

## Available APIs

- Subtitle generation API

  - ROUTE: `/subs/`
  - METHOD: POST
  - Query: None
  - Authentication: None
  - Body: multipart/form-data
    - file: File    (Video file whose subtitles need to be generated)
    - sourceCode: string    (Language of the video)
    - destCode: string    (Language of the subtitles)

```js
    Request: {
        file: File,
        sourceCode: 'ja',
        destCode: 'en'
    }

    Response: {
        "data": "A few days later, I was called by Kuon&#39;s mother, Ms. Mai.",
        "error": null,
        "success": true
    }
```
