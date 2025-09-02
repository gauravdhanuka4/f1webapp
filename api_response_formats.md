# F1 Web App API Response Formats

This document outlines the JSON response formats for the F1 Web App API.

## Information Endpoints (`/api/info`)

### `GET /schedule`

*   **Description:** Get the F1 schedule for a given year.
*   **Response Format:**
    ```json
    {
      "year": 2023,
      "races": [
        {
          "round": 1,
          "name": "Bahrain Grand Prix",
          "location": "Sakhir",
          "country": "Bahrain",
          "flagUrl": "https://example.com/flags/bahrain.png",
          "events": [
            {
              "type": "Practice 1",
              "startTime": "2023-03-03T12:30:00Z"
            }
          ]
        }
      ]
    }
    ```

### `GET /next-event`

*   **Description:** Get the next upcoming F1 event.
*   **Response Format:**
    ```json
    {
      "race": {
        "round": 10,
        "name": "British Grand Prix",
        "location": "Silverstone",
        "country": "UK",
        "flagUrl": "https://example.com/flags/uk.png"
      },
      "events": [
        {
          "type": "Practice 1",
          "startTime": "2023-07-07T12:30:00Z",
          "placeholder": true
        }
      ]
    }
    ```

### `GET /drivers`

*   **Description:** Get driver standings for a given year.
*   **Response Format:**
    ```json
    {
      "year": 2023,
      "standings": [
        {
          "position": "1",
          "driverName": "Max Verstappen",
          "teamName": "Red Bull Racing Honda RBPT",
          "points": "575"
        }
      ]
    }
    ```

### `GET /constructors`

*   **Description:** Get constructor standings for a given year.
*   **Response Format:**
    ```json
    {
      "year": 2023,
      "standings": [
        {
          "position": "1",
          "teamName": "Red Bull Racing Honda RBPT",
          "points": "860"
        }
      ]
    }
    ```

### `GET /events-by-status`

*   **Description:** Get F1 events grouped by status (past, current, future).
*   **Response Format:**
    ```json
    {
      "year": 2023,
      "past": [ ... ],
      "current": [ ... ],
      "future": [ ... ]
    }
    ```

## Prediction Endpoints (`/api/predict`)

### `GET /predict/qualifying_time`

*   **Description:** Predict the qualifying lap time for a given driver.
*   **Success Response:**
    ```json
    {
      "predicted_lap_time_seconds": 88.345,
      "predicted_lap_time_formatted": "01:28.345"
    }
    ```
*   **Error Response:**
    ```json
    {
      "error": "Missing required parameters: year, race, driver"
    }
    ```

### `POST /train/qualifying_time_model`

*   **Description:** Train the qualifying lap time prediction model.
*   **Success Response:**
    ```json
    {
      "message": "Model training initiated."
    }
    ```

## Race Analysis Endpoints (`/api/race-analysis`)

### `GET /race-pace/<year>/<race>`

*   **Description:** Get race pace comparison data for the top drivers.
*   **Response Format:**
    ```json
    {
      "drivers": [
        {
          "code": "VER",
          "name": "Max Verstappen",
          "color": "#3671C6",
          "team": "Red Bull Racing",
          "lapTimes": [88.1, 88.2, 88.0],
          "compounds": ["MEDIUM", "MEDIUM", "HARD"]
        }
      ],
      "session": {
        "name": "Bahrain Grand Prix",
        "year": 2023
      }
    }
    ```

### `GET /team-pace/<year>/<race>`

*   **Description:** Get team pace comparison data.
*   **Response Format:**
    ```json
    {
      "teams": [
        {
          "name": "Red Bull Racing",
          "color": "#3671C6",
          "lapTimes": {
            "min": 88.0,
            "q1": 88.2,
            "median": 88.5,
            "q3": 88.8,
            "max": 89.5
          }
        }
      ],
      "session": {
        "name": "Bahrain Grand Prix",
        "year": 2023
      }
    }
    ```

### `GET /lap-sections/<year>/<race>/<session>`

*   **Description:** Get lap sections analysis data for a list of drivers.
*   **Response Format:**
    ```json
    {
      "sections": [
        {
          "name": "braking",
          "drivers": [
            {
              "code": "VER",
              "color": "#3671C6",
              "time": [10.1, 15.2, 25.3],
              "speed": [280, 120, 290]
            }
          ]
        }
      ],
      "session": {
        "name": "Bahrain Grand Prix",
        "year": 2023
      }
    }
    ```

## Telemetry Endpoints (`/api/telemetry`)

### `GET /speed-trace/<year>/<race>/<session>/<driver1>/<driver2>`

*   **Description:** Compares the speed traces of two drivers on their fastest laps.
*   **Response Format:**
    ```json
    {
      "circuit": {
        "rotation": -15,
        "corners": [
          {"distance": 500, "number": 1, "letter": "T1"}
        ]
      },
      "driver1": {
        "name": "VER",
        "color": "#3671C6",
        "lapTime": "01:28.997",
        "distance": [0, 5, 10],
        "speed": [0, 100, 150]
      },
      "driver2": { ... },
      "session": {
        "name": "Bahrain Grand Prix",
        "year": 2023
      }
    }
    ```

### `GET /gear-shifts/<year>/<race>/<session>/<driver>`

*   **Description:** Provides gear shift data for a driver's fastest lap.
*   **Response Format:**
    ```json
    {
      "driver": {
        "name": "VER",
        "color": "#3671C6",
        "lapTime": "01:28.997"
      },
      "track": {
        "x": [1, 2, 3],
        "y": [1, 2, 3],
        "rotation": -15
      },
      "gears": [1, 2, 3],
      "speed": [100, 150, 200]
    }
    ```

### `GET /track-dominance/<year>/<race>/<session>`

*   **Description:** Shows which driver is fastest in different mini-sectors of the track.
*   **Response Format:**
    ```json
    {
      "track": {
        "x": [1, 2, 3],
        "y": [1, 2, 3],
        "rotation": -15
      },
      "miniSectors": [
        {
          "id": 0,
          "driver": "VER",
          "color": "#3671C6",
          "time": "0:00:05.123",
          "coordinates": {
            "x": [1, 2, 3],
            "y": [1, 2, 3]
          }
        }
      ],
      "drivers": [
        {
          "code": "VER",
          "name": "Max Verstappen",
          "number": 1,
          "color": "#3671C6"
        }
      ]
    }
    ```

### `GET /session-laps/<year>/<race>/<session>`

*   **Description:** Retrieves all lap data for a given session.
*   **Response Format:**
    ```json
    {
      "laps": [
        {
          "lapNumber": 1,
          "driverCode": "VER",
          "lapTime": 88.997,
          "compound": "MEDIUM"
        }
      ],
      "session": {
        "name": "Bahrain Grand Prix",
        "year": 2023
      }
    }
