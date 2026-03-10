export async function handler(event) {

    const { message, history } = JSON.parse(event.body);

    const API_KEY = process.env.GROQ_API_KEY;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "system", content: "You are Hasty, a friendly and helpful AI assistant." },
                ...history,
                { role: "user", content: message }
            ],
            max_tokens: 512,
            temperature: 0.7
        })
    });

    const data = await response.json();

    console.log('GROQ RESPONSE:', JSON.stringify(data));

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
}