import torch
from transformers import GPT2Tokenizer, GPT2LMHeadModel
from flask import Flask, request, jsonify
from flask_cors import CORS
import re

app = Flask(__name__)
CORS(app)

model_path = "./model"
my_chat_model = GPT2LMHeadModel.from_pretrained(model_path)
my_chat_tokenizer = GPT2Tokenizer.from_pretrained(model_path)

def generate_response(model, tokenizer, prompt, max_length=250):
    input_ids = tokenizer.encode(prompt, return_tensors="pt")
    attention_mask = torch.ones_like(input_ids)
    pad_token_id = tokenizer.eos_token_id

    output = model.generate(
        input_ids,
        max_length=max_length,
        num_return_sequences=1,
        attention_mask=attention_mask,
        pad_token_id=pad_token_id
    )

    return tokenizer.decode(output[0], skip_special_tokens=True)

def extract_sentences(text):
    sentences = re.split(r'(?<=[.!?])+', text)
    if len(sentences) >= 3:
        return sentences[1] + ' ' + sentences[2]
    else:
        return None

@app.route('/generate_response', methods=['POST'])
def generate_response_api():
    data = request.get_json()
    prompt = data['prompt']
    response = generate_response(my_chat_model, my_chat_tokenizer, prompt, max_length=100)
    short_response = extract_sentences(response)
    return jsonify({"response": short_response})

if __name__ == "__main__":
    app.run(debug=True)
