# Counter-Begal REST API Documentation

## Endpoint
http://localhost:3000

---

## Create Report

- URL
  - `/reports`

- Method
  - `POST`

- Headers
  - `Content-Type: application/json`

- Request Body
  - `id` as `string`
  - `name` as `string`
  - `description` as `string`
  - `city` as `string`
  - `photo` as `file`, max 2 MB
  - `longitude` as `float`
  - `latitude` as `float`

- Response example
```json
{
  "error": "false",
  "message": "Success"
}
```

## Get All Reports

- URL
  - `/reports`

- Method
  - `GET`

- Response example
```json
{
  "error": "false",
  "message": "Success",
  "reports": [
    {
      "id": "begal-12345",
      "name": "Bima Adityo Kurniawan",
      "description": "Begal activity seen around Indomaret",
      "city": "Semarang",
      "photoUrl": "https://images.pexels.com/photos/13268478/pexels-photo-13268478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "lon": 106.761429,
      "lat": -6.547753,
      "createdAt": "2024-11-08T06:34:18.598Z"
    }
  ]
}
```

## Get Selected Report

- URL
  - `/reports/:productId`

- Method
  - `GET`

- Response
```json
{
  "error": "false",
  "message": "Success",
  "report": {
      "id": "begal-12345",
      "name": "Bima Adityo Kurniawan",
      "description": "Begal activity seen around Indomaret",
      "city": "Semarang",
      "photoUrl": "https://images.pexels.com/photos/13268478/pexels-photo-13268478.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      "lon": 106.761429,
      "lat": -6.547753,
      "createdAt": "2024-11-08T06:34:18.598Z"
    }
}
```

## Delete Selected Report

- URL
  - `/reports/:productId`

- Method
  - `DELETE`

- Response
```json
{
  "error": "false",
  "message": "Success",
}
```