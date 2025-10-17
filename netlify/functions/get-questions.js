// netlify/functions/get-questions.js

exports.handler = async function(event, context) {
  try {
    const evaluationId = event.queryStringParameters && event.queryStringParameters.evaluation_id;
    if (!evaluationId) {
      return { statusCode: 400, body: JSON.stringify({ error: "Falta evaluation_id" }) };
    }

    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
    const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || "5. Evaluaciones (técnicas, soft skills e inglés)";

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}?filterByFormula=RECORD_ID()="${evaluationId}"`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_API_KEY}` }
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: text }) };
    }

    const data = await res.json();

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: true, data: data.records })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
