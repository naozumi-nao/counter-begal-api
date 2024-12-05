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
  - `name` as `String`
  - `description` as `String`
  - `city` as `String`
  - `photo` as `file`, max 2 MB
  - `longitude` as `Number`
  - `latitude` as `Number`

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
      "_id": "begal-12345",
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
      "_id": "begal-12345",
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