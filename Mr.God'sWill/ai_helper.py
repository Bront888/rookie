
import os

import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = os.getenv("OPENROUTER_MODEL", "openrouter/free")
API_URL = "https://openrouter.ai/api/v1/chat/completions"


def get_ai_solution(issue: str) -> str:
    if not API_KEY:
        raise RuntimeError(
            "OPENROUTER_API_KEY is missing. Check your .env file."
        )

    if not issue or not issue.strip():
        raise ValueError("The issue description cannot be empty.")

    payload = {
        "model": MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a technical troubleshooting assistant. "
                    "Analyze the reported issue and explain likely causes. "
                    "Give clear, numbered steps to diagnose and resolve it. "
                    "Explain how to verify the fix. If information is missing, "
                    "state your assumptions and ask focused questions. "
                    "Do not guarantee success or recommend destructive "
                    "actions without explaining the risks."
                ),
            },
            {
                "role": "user",
                "content": issue.strip(),
            },
        ],
        "temperature": 0.3,
        "max_tokens": 700,
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            API_URL,
            headers=headers,
            json=payload,
            timeout=60,
        )

        if response.status_code == 401:
            raise RuntimeError(
                "OpenRouter rejected the API key. Check your .env file."
            )

        if response.status_code == 402:
            raise RuntimeError(
                "The request requires credits. Check that the selected "
                "model is free and your OpenRouter account status."
            )

        if response.status_code == 429:
            raise RuntimeError(
                "OpenRouter rate limit reached. Try again later."
            )

        response.raise_for_status()
        data = response.json()

        solution = data["choices"][0]["message"]["content"]

        if not isinstance(solution, str) or not solution.strip():
            raise RuntimeError("The AI returned an empty response.")

        return solution.strip()

    except requests.Timeout as error:
        raise RuntimeError(
            "The AI request timed out. Please try again."
        ) from error

    except requests.RequestException as error:
        raise RuntimeError(
            "Could not connect to OpenRouter. Check your connection "
            "and try again."
        ) from error

    except (KeyError, IndexError, TypeError, ValueError) as error:
        raise RuntimeError(
            "OpenRouter returned an unexpected response."
        ) from error
